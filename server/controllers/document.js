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



module.exports={handleDocumentGetRequest, handleDocumentCreateRequest, handleDocumentPatchRequest, handleDocumentDeleteRequest, handleAddingCollaboratorsRequest}