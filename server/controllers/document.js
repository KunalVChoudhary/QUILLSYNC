const Document = require("../models/document")
const User = require("../models/user")


const handleDocumentGetRequest = (req,res)=>{
    try {
        return res.status(200).json({document:req.document})
    } catch (error) {
        return res.status(500).json({message:'Server Error'})
    }
}


module.exports={handleDocumentGetRequest}