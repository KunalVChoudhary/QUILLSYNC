const User=require('../models/user')
const bcrypt =require('bcrypt');
const { setJWT } = require('../service/auth');


const handleUserRegister=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        // Create Token
        const jwtToken = setJWT(user)
        res.cookie('token', jwtToken, {
            httpOnly: true,      
            //secure: true,        
            //sameSite: 'Strict', 
            maxAge: 3600000*24      
        });
        res.status(200).json({message:"Registeration Successfull", username:user.username})
    }
    catch(err){

        //Check for if user with the same mail already exists
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email){
            return res.status(400).json({ message: "Email already exists" })
        }else{
            return res.status(500).json({ message: "Could not signup, try again" });
        }
    }
}

const handleUserLogin=async(req,res,next)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message:" User doesn't exist. Try Again"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message:" User doesn't exist. Try Again"})
        }

        // Create Token
        const jwtToken = setJWT(user)
        res.cookie('token', jwtToken, {
            httpOnly: true,      
            //secure: true,        
            //sameSite: 'Strict', 
            maxAge: 3600000*24      
        });

        return res.status(200).json({message:"Login Successfull", username:user.username})
        
    }
    catch(err){
        return res.status(500).json({ message: "Could not signin, try again" });
    }
}


const handleUserLogout = (req, res) => {
    try{
        res.clearCookie('token', {
        httpOnly: true,
        // secure: true,        // Uncomment this if you're using HTTPS
        // sameSite: 'Strict'   // Match the original settings if needed
    });
    res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: "Could not signin, try again" });
    }
};

//used in check auth
const checker=async(req,res)=>{
    try {
        const user = await User.findById(req.user.userId)
        if (user){
            return res.status(200).json({username:user.username})
        }
        else{
            return res.status(400).json('USer doesnt exist')
        }
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}


module.exports={handleUserRegister,handleUserLogin,handleUserLogout,checker}