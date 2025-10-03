import { useState } from "react"

export default function useGetUserDocs(){
    const [ownedDocuments, setOwnedDocuments] = useState([])
    const [collaboratorDocuments, setCollaboratorDocuments] = useState([])
    const [fetchError, setFetchError] = useState('')
    const [loading, setLoading] = useState(false)

    const getUserDocs = async ()=>{
        try {
            setLoading(true);
            setFetchError("");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/user`,{
                method:'GET',
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok){
                setOwnedDocuments(data.ownedDocuments)
                setCollaboratorDocuments(data.collaboratorDocuments)
            } else {
                setFetchError(data.message || "Failed to fetch documents");
            }
        } catch (error) {
            setFetchError(error.message)
            console.error(error);
        } finally{
            setLoading(false)
        }
    }

    return {ownedDocuments, collaboratorDocuments, fetchError, loading, getUserDocs}
}