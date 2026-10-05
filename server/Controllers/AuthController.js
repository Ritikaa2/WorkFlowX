const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const UserModel = require("../Models/User");
const { setCache, delCache, delPattern } = require("../Utils/redisClient");

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(409).json({
                message: 'User already exists, please login',
                success: false
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user with specified or default role
        const newUser = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "employee",
            status: "active"
        });

        // Save user
        await newUser.save();

        // Invalidate user & stats Redis cache
        await delPattern("users:*");
        await delCache("stats:dashboard");

        // Generate token immediately for smooth onboarding
        const jwtToken = jwt.sign(
            {
                email: newUser.email,
                _id: newUser._id,
                role: newUser.role,
                name: newUser.name
            },
            process.env.JWT_SECRET || "secret-123",
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: "Account created successfully!",
            success: true,
            jwtToken,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status
            }
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await UserModel.findOne({ email: normalizedEmail });
        const errmsg = 'Invalid email or password';
        
        if (!user) {
            return res.status(403).json({
                message: errmsg,
                success: false
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                message: "Your account is deactivated. Please contact your administrator.",
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: errmsg,
                success: false
            });
        }

        // Create JWT token
        const jwtToken = jwt.sign(
            {
                email: user.email,
                _id: user._id,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET || "secret-123",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status
            },
            email: user.email,
            name: user.name,
            role: user.role
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this email",
                success: false
            });
        }

        // 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Store OTP in Redis (TTL: 600s / 10 minutes)
        await setCache(`otp:${normalizedEmail}`, otp, 600);

        // Attempt sending email via nodemailer if configured
        if (process.env.EMAIL && process.env.EMAIL_PASSWORD) {
            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: `"WorkFlowX" <${process.env.EMAIL}>`,
                    to: normalizedEmail,
                    subject: "WorkFlowX Password Reset OTP",
                    html: `
                    <div style="font-family:Arial,sans-serif;background:#f4f8ff;padding:40px;">
                        <div style="max-width:500px;margin:auto;background:white;padding:35px;border-radius:12px;">
                            <h2 style="color:#1769ff;text-align:center;">WorkFlowX</h2>
                            <h3 style="color:#172554;">Password Reset Code</h3>
                            <p style="color:#64748b;">Your verification OTP code is:</p>
                            <div style="background:#eef4ff;text-align:center;padding:20px;border-radius:8px;margin:20px 0;">
                                <h1 style="color:#1769ff;letter-spacing:8px;margin:0;">${otp}</h1>
                            </div>
                            <p style="color:#64748b;">This OTP is valid for 10 minutes.</p>
                        </div>
                    </div>`
                });
            } catch (mailErr) {
                console.warn("Mail send warning (continuing with OTP):", mailErr.message);
            }
        }

        res.status(200).json({
            message: "OTP sent successfully! Check your email or use test OTP.",
            success: true,
            otpDemo: otp
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        const user = await UserModel.findOne({
            email: normalizedEmail,
            otp
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid OTP code",
                success: false
            });
        }

        if (user.otpExpiry && user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new one.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Invalidate Redis OTP
        await delCache(`otp:${normalizedEmail}`);

        res.status(200).json({
            message: "Password reset successfully! You can now login.",
            success: true
        });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
};