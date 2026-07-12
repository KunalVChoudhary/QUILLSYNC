import { checkJWT } from "../services/authService.js";
import type { RequestHandler } from 'express';

//middleware to check if client is authorized to use a certain feature
export const userAuthorization:RequestHandler=(req,res,next)=>{
    const token:string|undefined=req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = checkJWT(token);
    if (!decoded) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
    req.user = decoded;
    next();
}