import {Schema, model, type InferSchemaType} from 'mongoose';

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
            content: {
                type: Buffer,
                default: null,
            },
            editedAt: {
            type: Date,
            default: Date.now
            }
        }
    ]

},{
    timestamps:true
})

type DocumentType = InferSchemaType<typeof documentSchema>

const Document = model<DocumentType>('document',documentSchema)

export default Document