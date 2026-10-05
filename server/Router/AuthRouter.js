const { signupValidation, loginValidation } = require("../Middlewares/Validation");
const { signup,login,forgotPassword, resetPassword} = require("../Controllers/AuthController");

const router = require("express").Router();

router.post("/login",loginValidation,login);
router.post("/signup", signupValidation, signup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;