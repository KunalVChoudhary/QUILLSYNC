import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

type DeleteDocumentResponse ={
    success: boolean,
    message: string
}

function useDeleteDoc(){
     const [loading, setLoading] = useState(false);
    const { setReloader} = useAuth()
    const deleteDocument = async (docId: string): Promise<DeleteDocumentResponse>=>{
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${docId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data: DeleteDocumentResponse = await response.json();

            if (data.success) {
                toast.success('Document Deleted Successfully');
                setReloader(prev => prev + 1)
            } else {
                toast.error(data.message);
            }
            return data;
        } catch (error) {
            if (error instanceof Error){
                console.error(error);
                toast.error(error.message);
                return { success: false, message: error.message };
            }
            return { success: false, message: 'Some Unknown Error Occured' }
        } finally{
            setLoading(false)
        }
    }

    return {deleteDocument, loading}
}

export default useDeleteDoc