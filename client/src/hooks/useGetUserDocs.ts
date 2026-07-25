import { useState } from "react"

type GetDocumentListResponse = 
   | {
        success: true,
        ownedDocuments: [string,string][],
        collaboratorDocuments: [string, string][]

    }
  | {
        success: false,
        message: string
  }

export default function useGetUserDocs(){
    const [ownedDocuments, setOwnedDocuments] = useState < [string, string][]>([])
    const [collaboratorDocuments, setCollaboratorDocuments] = useState < [string, string][]>([])
    const [fetchError, setFetchError] = useState('')
    const [loading, setLoading] = useState(false)

    const getUserDocs = async (): Promise<void>=>{
        try {
            setLoading(true);
            setFetchError("");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/user`,{
                method:'GET',
                credentials: 'include'
            })
            const data: GetDocumentListResponse = await response.json()
            if (data.success){
                setOwnedDocuments(data.ownedDocuments)
                setCollaboratorDocuments(data.collaboratorDocuments)
            } else {
                setFetchError(` Failed to fetch documents.\n${data.message}`);
            }
        } catch (error) {
            if (error instanceof Error){
                setFetchError(error.message)
                console.error(error);
            }
        } finally{
            setLoading(false)
        }
    }

    return {ownedDocuments, collaboratorDocuments, fetchError, loading, getUserDocs}
}