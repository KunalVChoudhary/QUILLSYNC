import { useAuth } from "./useAuth";

function useDeleteDoc(){
    const {setReloader} = useAuth()
    const deleteDocument = async (docId)=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${docId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Document Deleted Successfully');
                return { success: true, data };
            } else {
                toast.error(data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally{
            setReloader(prev=>prev+1)
        }
    }

    return {deleteDocument}
}

export default useDeleteDoc