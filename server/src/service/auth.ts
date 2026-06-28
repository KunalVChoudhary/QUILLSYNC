import jwt from 'jsonwebtoken';

export interface AuthPayload {
    userId:string
}

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
    throw new Error("JWT_SECRET_KEY is missing");
}

//sign JWT Token
export const setJWT=(payload:AuthPayload):string=>{

    return jwt.sign(
            payload,
            secret,
            { expiresIn: '24h' }
        );
}

//verify JWT Token 
export const checkJWT=(token:string): AuthPayload|false =>{
    try {
        return jwt.verify(token,secret) as AuthPayload
    } catch {
        return false
    }
}