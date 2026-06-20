require('dotenv').config()
import jwt, {type JwtPayload} from 'jsonwebtoken';
import { type HydratedDocument } from 'mongoose';
import {type UserType} from '../models/user.js'

//sign JWT Token
export const setJWT=(user:HydratedDocument<UserType>):string=>{
    const secret: string|undefined = process.env.JWT_SECRET_KEY

    if (!secret) {
        throw new Error('JWT_SECRET_KEY is missing');
    }

    return jwt.sign(
            { userId: user._id},
            secret,
            { expiresIn: '24h' }
        );
}

//verify JWT Token 
export const checkJWT=(token:string): JwtPayload|string|false =>{
    const secret: string|undefined = process.env.JWT_SECRET_KEY

    if (!secret) {
        throw new Error('JWT_SECRET_KEY is missing');
    }
    try {
        return jwt.verify(token,secret)
    } catch {
        return false
    }
}