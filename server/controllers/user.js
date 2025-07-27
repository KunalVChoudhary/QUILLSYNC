const User=require('../models/user')
const bcrypt =require('bcrypt');
const { setJWT } = require('../service/auth');


const handleUserRegister=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(200).json()
    }
    catch(err){

        //Check for if user with the same mail already exists
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email){
            return res.status(400).json({ message: "Email already exists" })
        }else{
            console.error(err);
            return res.status(500).json({ message: "Could not signup, try again" });
        }
    }
}

const handleUserLogin=async(req,res,next)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({error:'user',message:" User doesn't exist. Please Login"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({error:'password',message:" User doesn't exist. Please Login"})
        }

        // Create Token
        const jwtToken = setJWT(user)
        res.cookie('token', jwtToken, {
            httpOnly: true,      
            //secure: true,        
            //sameSite: 'Strict', 
            maxAge: 3600000*24      
        });

        return res.status(200).json({error:'none',message:" User found"})
        
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: "Could not signin, try again" });
    }
}

module.exports={handleUserRegister,handleUserLogin}