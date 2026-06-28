import { Types} from "mongoose"
import Document from "../models/document.js"
import User from "../models/user.js"
import type { RequestHandler } from "express"
import { resolveCollaborators } from "../service/collaboratorService.js"


//documents controllers


//function to get the requested document
export const handleDocumentGetRequest:RequestHandler = (req,res)=>{
    return res.status(200).json({document:req.document})
}


//function to handle document create request
export const handleDocumentCreateRequest:RequestHandler = async (req,res)=>{
    try {
        const {title,collaborators} = req.body
        const owner=req.user!.userId

        const {failedCollaborator,finalCollaborators} = await resolveCollaborators(collaborators)
        const document = await Document.create({title,owner,collaborators:finalCollaborators})
        return res.status(201).json({document,failedCollaborator})

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Server Error'})
    }
}


// Uncompleted function
export const handleDocumentPatchRequest: RequestHandler = async (req,res)=>{

}


//function to handle document deletion request
export const handleDocumentDeleteRequest: RequestHandler = async (req,res)=>{
    try {
        await Document.findByIdAndDelete(req.document!._id)
        return res.status(200).json({
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Server Error'})
    }
}


//function to add new collaborators to a document
export const handleAddingCollaboratorsRequest: RequestHandler = async (req,res)=>{
    try {
        const {collaborators} = req.body
        const {failedCollaborator,finalCollaborators} = await resolveCollaborators(collaborators)
        const document = await Document.findByIdAndUpdate(req.document!._id,
            {
                $addToSet: {
                    collaborators: { $each: finalCollaborators }
                }
            },
            {new:true})
        return res.status(200).json({document,failedCollaborator})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Server Error'})
    }
}


//function to remove collaborators from a document
export const handleRemovingCollaboratorsRequest: RequestHandler = async (req,res)=>{
    try {
        const {collaborators} = req.body
        const failedCollaborator: string[]=[]
        const removeId: Types.ObjectId[]=[]
        if (collaborators){
            await Promise.all(
                collaborators.map(async (email: string)=>{
                    const user = await User.findOne({ email })
                    if (!user){
                            failedCollaborator.push(email)
                    } else{
                        removeId.push(user._id)
                    }
                    return true
                    
                })
            )
            const newCollaborators = req.document!.collaborators.filter(
                (id) => !removeId.some(removeIdVal => removeIdVal.equals(id))
            );
            const document = await Document.findByIdAndUpdate(req.document!._id,{collaborators:newCollaborators},{new:true})
            return res.status(200).json({document,failedCollaborator})

        }} catch (error){
            console.log(error);
            return res.status(500).json({message:'Server Error'})
        }
}


//function to handle fet request for all authorised document for a user
export const handleGetAuthorizedDocumentsListRequest: RequestHandler = async (req,res)=>{
    try {
        const userId = new Types.ObjectId(req.user!.userId)
        const docs = await Document.find({
            $or: [{ owner: userId }, { collaborators: userId }]
            });

        const ownedDocs:[Types.ObjectId,string][] = [];
        const collaboratorDocs:[Types.ObjectId,string,Types.ObjectId][] = [];

        docs.forEach(doc => {
        if (doc.owner.equals(userId)) ownedDocs.push([doc._id,doc.title]);
        else collaboratorDocs.push([doc._id,doc.title,doc.owner]);
        });

        return res.json({ ownedDocuments: ownedDocs, collaboratorDocuments: collaboratorDocs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Server Error'})
    }
}