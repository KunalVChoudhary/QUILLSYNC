const { checkJWT } = require("../service/auth")

//middleware to check if client is authorized to use a certain feature
const authorization=(req,res,next)=>{
    const token=req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = checkJWT(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
    
//after middleware next call this
const checker=(req,res)=>{
    return res.status(200).json({message:`${req.user.userId}`})
}

module.exports={authorization,checker}