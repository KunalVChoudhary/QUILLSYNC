const { Types } = require("mongoose")
const Document = require("../models/document")
const User = require("../models/user")


//documents controllers
const handleDocumentGetRequest = (req,res)=>{
    try {
        return res.status(200).json({document:req.document})
    } catch (error) {
        return res.status(500).json({message:'Server Error'})
    }
}

const handleDocumentCreateRequest = async (req,res)=>{
    try {
        const {title,collaborators} = req.body
        const owner=req.user.userId
        const failedCollaborator=[]
        let finalCollaborators = []
        if (collaborators){
            const users = await Promise.all(
                collaborators.map(async (email) =>{
                    const user = await User.findOne({ email })
                    if (!user){
                        failedCollaborator.push(email)
                    }
                    return user
                })
            )
            finalCollaborators = users.filter(user => user !== null)
            .map(user => user._id);
        }
        const document = await Document.create({title,owner,collaborators:finalCollaborators})
        return res.status(200).json({document,failedCollaborator})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Server Error'})
    }
}

const handleDocumentPatchRequest = async (req,res)=>{

}

const handleDocumentDeleteRequest = async (req,res)=>{
    try {
        await Document.findByIdAndDelete(req.document._id)
        return res.status(200).json("document is deleted")
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Server Error'})
    }
}

//collaborators controllers

const handleAddingCollaboratorsRequest = async (req,res)=>{
    try {
        const {collaborators} = req.body
        const failedCollaborator=[]
        let finalCollaborators = []
        if (collaborators){
            const users = await Promise.all(
                collaborators.map(async (email) =>{
                    const user = await User.findOne({ email })
                    if (!user){
                        failedCollaborator.push(email)
                    }
                    return user
                })
            )
            finalCollaborators = users.filter(user => user !== null)
            .map(user => user._id);
        }
        const document = await Document.findOneAndUpdate({_id:req.document._id},{collaborators:req.document.collaborators.concat(finalCollaborators)},{new:true})
        return res.status(200).json({document,failedCollaborator})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Server Error'})
    }
}



const handleRemovingCollaboratorsRequest = async (req,res)=>{
    try {
        const {collaborators} = req.body
        const failedCollaborator=[]
        const removeId=[]
        if (collaborators){
            const users=await Promise.all(
                collaborators.map(async (email,index)=>{
                    const user = await User.findOne({ email })
                    if (!user){
                            failedCollaborator.push(email)
                    } else{
                        removeId.push(user._id)
                    }
                    return true
                    
                })
            )
            const newCollaborators = req.document.collaborators.filter(
                (id) => !removeId.some(removeIdVal => removeIdVal.equals(id))
            );
            const document = await Document.findOneAndUpdate({_id:req.document._id},{collaborators:newCollaborators},{new:true})
            return res.status(200).json({document,failedCollaborator})

        }} catch (error){
            console.log(error);
            return res.status(500).json({message:'Server Error'})
        }
}

//Document Authorized to access controllers

const handleGetAuthorizedDocumentsListRequest = async (req,res)=>{
    try {
        const userId = new Types.ObjectId(req.user.userId)
        const docs = await Document.find({
            $or: [{ owner: userId }, { collaborators: userId }]
            });

        const ownedDocs = [];
        const collaboratorDocs = [];

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



module.exports={handleDocumentGetRequest, handleDocumentCreateRequest, handleDocumentPatchRequest, handleDocumentDeleteRequest, handleAddingCollaboratorsRequest, handleRemovingCollaboratorsRequest, handleGetAuthorizedDocumentsListRequest}