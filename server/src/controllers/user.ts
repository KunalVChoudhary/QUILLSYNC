import User from "../models/user.js";
import bcrypt from 'bcrypt'
import { setJWT } from "../service/auth.js";
import { type RequestHandler } from "express";
import { MongoServerError } from "mongodb";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 24 * 60 * 60 * 1000,
};

export const handleUserRegister:RequestHandler=async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        // Create Token
        const jwtToken = setJWT({userId:String(user._id)})
        res.cookie('token', jwtToken, cookieOptions);
        return res.status(200).json({message:"Registration Successful", username:user.username})
    }
    catch(err){
        
        if (err instanceof MongoServerError && err.code === 11000 && err.keyPattern && err.keyPattern.email){
            //Check for if user with the same mail already exists
                return res.status(400).json({ message: "Email already exists" })
        }
        console.error(err);
        return res.status(500).json({ message: "Could not signup, try again" });
    }
}

export const handleUserLogin:RequestHandler=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }

        // Create Token
        const jwtToken = setJWT({userId: String(user._id)})
        res.cookie('token', jwtToken, cookieOptions);

        return res.status(200).json({message:"Login Successful", username:user.username})
        
    }
    catch(err){
        return res.status(500).json({ message: "Could not signin, try again" });
    }
}


export const handleUserLogout:RequestHandler = (req, res) => {
    try{
        res.clearCookie('token', {
        httpOnly: true,
        secure: true,       
        sameSite: 'none'  
    });
    res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: "Could not signin, try again" });
    }
};

//used in check auth
export  const checker:RequestHandler=async(req,res)=>{
    try {
        const user = await User.findById(req.user!.userId)
        if (user){
            return res.status(200).json({username:user.username})
        }
        else{
            return res.status(400).json("User doesn't exist")
        }
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}