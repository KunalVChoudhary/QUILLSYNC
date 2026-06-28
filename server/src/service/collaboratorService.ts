import mongoose from "mongoose"
import User from "../models/user.js"

export async function resolveCollaborators(collaborators:string[]):Promise<{failedCollaborator:string[];finalCollaborators:mongoose.Types.ObjectId[];}>{
    const failedCollaborator:string[]=[]
    const users = await Promise.all(
        collaborators.map(async (email:string) =>{
            const user = await User.findOne({ email })
            if (!user){
                failedCollaborator.push(email)
            }
            return user
        })
    )
    const finalCollaborators:mongoose.Types.ObjectId[] = users.filter(user => user !== null)
    .map(user => user._id);
    return {
        failedCollaborator,
        finalCollaborators,
    };
}