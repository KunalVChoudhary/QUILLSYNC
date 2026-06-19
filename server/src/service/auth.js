require('dotenv').config()
const jwt = require('jsonwebtoken')

//sign JWT Token
const setJWT=(user)=>{
    return jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );
}

//verify JWT Token
const checkJWT=(token)=>{
    try {
        return jwt.verify(token,process.env.JWT_SECRET_KEY)
    } catch {
        return false
    }
}

module.exports={setJWT,checkJWT}