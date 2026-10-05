const signupValidation=(req,res,next)=>{
    const {name,email,password}=req.body;
    // name email and pass should be required
    if(!name || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        });
    }
    // name validation 
    if(typeof name!="string" || name.trim().length<3){
        return res.status(400).json({
            message:"Name must be atleast 3 characters"
        });
    }
    // email validation
    if(!email.includes("@") || !email.includes(".")){
        return res.status(400).json({
            message: "Invalid email"
        });
    }
    // password validation
    if(password.length < 6){
       return res.status(400).json({
         message: "Password must be at least 6 characters"
       });
    }
    next();
};


// Login Validation
const loginValidation = (req, res, next) => {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({
            message: "Invalid email"
        });
    }

    // Password validation
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    next();
};


module.exports = {
    signupValidation,
    loginValidation
};