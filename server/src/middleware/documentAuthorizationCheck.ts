import mongoose from "mongoose";
import Document from "../models/document.js";
import { type RequestHandler } from "express";

interface DocumentParams {
    docId: string;
}

export const documentAuthorizationCheck:RequestHandler<DocumentParams> = async (req,res,next)=>{
    try {
        const document=await Document.findById(req.params.docId)
        if (!document){
            return res.status(404).json({message:'Document not found'})
        }
        if ((req.user!.userId != document.owner.toString()) && (!document.collaborators.some(id => id.toString() === req.user!.userId))){
            const err= new Error('Not Authorized To Access')
            err.name='NotAuthorized'
            throw err
        }
        req.document = document;
        next()
    } catch (error) {
        if (error instanceof Error){
            if (error.name=='NotAuthorized'){
                return res.status(401).json({message:error.message})
            } else if (error.name === "CastError") {
                return res.status(400).json({ message: "Invalid ID format" });
            }
        }
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
    
}

export const documentOwnerAuthorizationCheck:RequestHandler<DocumentParams> = async(req,res,next)=>{
     try {
        const document=await Document.findById(req.params.docId)
        if (!document){
            return res.status(404).json({message:'Document not found'})
        }
        if (req.user!.userId != document.owner.toString()){
            const err= new Error('Not Authorized To Access')
            err.name='NotAuthorized'
            throw err
        }
        req.document = document;
        next()
    } catch (error) {
        if (error instanceof Error){
            if (error.name=='NotAuthorized'){
                return res.status(401).json({message:error.message})
            } else if (error.name === "CastError") {
                return res.status(400).json({ message: "Invalid ID format" });
            }
        }
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}