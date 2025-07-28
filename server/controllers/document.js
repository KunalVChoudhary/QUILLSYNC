const Document = require("../models/document")
const User = require("../models/user")


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
            collaborators = users.filter(user => user !== null)
            .map(user => user._id);
        }
        const document = await Document.create({title,owner,collaborators})
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



module.exports={handleDocumentGetRequest, handleDocumentCreateRequest, handleDocumentPatchRequest, handleDocumentDeleteRequest}