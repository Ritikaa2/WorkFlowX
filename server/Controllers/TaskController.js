const mongoose = require("mongoose");
const TaskModel = require("../Models/Task");
const NotificationModel = require("../Models/Notification");
const { getCache, setCache, delCache, delPattern } = require("../Utils/redisClient");

// Helper to clear task and dashboard caches
const clearTaskCache = async (taskId) => {
  await delPattern("tasks:*");
  await delCache("stats:dashboard");
  if (taskId) await delCache(`task:${taskId}`);
};

// 1. Get Tasks (Redis Cached)
const getTasks = async (req, res) => {
  try {
    const { role, email, name } = req.user || {};
    const { status, priority, search } = req.query;
    const cacheKey = `tasks:${role || "all"}:${email || "all"}:${status || "all"}:${priority || "all"}:${search || "none"}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ success: true, tasks: cached, total: cached.length, fromCache: true });
    let filter = {};
    if (role === "employee" && email) {
      filter.$or = [{ assignedToEmail: email.toLowerCase() }, { assignedToName: new RegExp(name || "", "i") }];
    }
    if (status && status !== "All") filter.status = status;
    if (priority && priority !== "All") filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { assignedToName: { $regex: search, $options: "i" } },
      ];
    }
    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });
    await setCache(cacheKey, tasks, 120);
    res.status(200).json({ success: true, tasks, total: tasks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};

// 2. Get Task by ID (Redis Cached)
const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: "Invalid ID" });
    const cacheKey = `task:${req.params.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ success: true, task: cached, fromCache: true });
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    await setCache(cacheKey, task, 300);
    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching task" });
  }
};

// 3. Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedToName, assignedToEmail, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const task = new TaskModel({
      title,
      description: description || "",
      assignedToName: assignedToName || "Unassigned",
      assignedToEmail: (assignedToEmail || "").toLowerCase(),
      assignedByName: req.user?.name || "Manager",
      priority: priority || "Medium",
      status: "Pending",
      dueDate: dueDate || "",
      activityLogs: [{ action: `Task assigned to ${assignedToName || "team"}`, user: req.user?.name || "Manager" }],
    });
    await task.save();
    await clearTaskCache();
    await NotificationModel.create({
      userEmail: (assignedToEmail || "").toLowerCase(),
      title: "New Task Assigned",
      message: `${req.user?.name || "Manager"} assigned: "${title}"`,
      type: "task_assigned",
    });
    res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating task" });
  }
};

// 4. Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: "Invalid ID" });
    const { status } = req.body;
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    task.status = status;
    task.activityLogs.push({ action: `Status changed to ${status}`, user: req.user?.name || "User" });
    await task.save();
    await clearTaskCache(req.params.id);
    await NotificationModel.create({
      title: status === "Completed" ? "Task Completed" : "Task Status Updated",
      message: `${req.user?.name || "User"} marked "${task.title}" as ${status}`,
      type: status === "Completed" ? "task_completed" : "status_updated",
    });
    res.status(200).json({ success: true, message: `Status updated to ${status}`, task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// 5. Update Task Details
const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: "Invalid ID" });
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    await clearTaskCache(req.params.id);
    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating task" });
  }
};

// 6. Delete Task
const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: "Invalid ID" });
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    await clearTaskCache(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
};

// 7. Add Comment
const addComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: "Invalid ID" });
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    const comment = { userName: req.user?.name || "User", userRole: req.user?.role || "employee", text: text.trim() };
    task.comments.push(comment);
    task.activityLogs.push({ action: `Comment added by ${req.user?.name || "User"}`, user: req.user?.name || "User" });
    await task.save();
    await clearTaskCache(req.params.id);
    await NotificationModel.create({
      title: "New Comment",
      message: `${req.user?.name || "User"} commented on "${task.title}"`,
      type: "new_comment",
    });
    res.status(200).json({ success: true, message: "Comment added", comments: task.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding comment" });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTaskStatus, updateTask, deleteTask, addComment };
