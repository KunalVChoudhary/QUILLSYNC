const mongoose = require("mongoose");
const Document = require("../models/document");

const documentAuthorizationCheck = async (req,res,next)=>{
    try {
        const documentId=new mongoose.Types.ObjectId(req.params.docId);
        const document=await Document.findById(documentId)
        if (!document){
            return res.status(404).json({message:'Document not found'})
        }
        if ((req.user.userId.toString() != document.owner.toString()) && (!document.collaborators.some(id => id.toString() === req.user.toString()))){
            const err= new Error('Not Authorized To Access')
            err.name='NotAuthorized'
            throw err
        }
        req.document = document;
        next()
    } catch (error) {
        if (error.name=='NotAuthorized'){
            return res.status(401).json({message:error.message})
        } else if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
    
}

const documentOwnerAuthorizationCheck= async(req,res,next)=>{
     try {const documentId=new mongoose.Types.ObjectId(req.params.docId);
        const document=await Document.findById(documentId)
        if (!document){
            return res.status(404).json({message:'Document not found'})
        }
        if (req.user.userId.toString() != document.owner.toString()){
            const err= new Error('Not Authorized To Access')
            err.name='NotAuthorized'
            throw err
        }
        req.document = document;
        next()
    } catch (error) {
        if (error.name=='NotAuthorized'){
            return res.status(401).json({message:error.message})
        } else if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports={documentAuthorizationCheck, documentOwnerAuthorizationCheck}