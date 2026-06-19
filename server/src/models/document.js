const {Schema, model} = require('mongoose')

const documentSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:Buffer,
        default:null,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    collaborators:[
        {
            type:Schema.Types.ObjectId,
            ref:'user',
        }
    ],
    lastEdited:{
        type: Date,
        default: Date.now,
    },
    // history:{
    //     type:String,
    //     default:''
    // }
    history: [
        {
            content: String,
            editedAt: {
            type: Date,
            default: Date.now
            }
        }
    ]

},{timestamps:true})

const Document = model('document',documentSchema)

module.exports=Document