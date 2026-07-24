import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth"
import { Document } from "../types/document.types";

interface CreateDocumentFormData {
    title: string,
    collaborators: string[]
}

type CreateDocumentResponse =
  | {
        success: true;
        document: Document;  //document model
        failedCollaborator: string[];
    }
  | {
        success: false;
        message: string;
    };




export default function useCreateDoc() {
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { setReloader } = useAuth()

    useEffect(() => {
        // On component unmount, abort the request
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const createDocument = async (formData: CreateDocumentFormData): Promise<CreateDocumentResponse> => {
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
                signal: abortControllerRef.current.signal,
            });

            const data: CreateDocumentResponse = await response.json();

            if (data.success) {
                toast.success('Document Created Successfully');
                setReloader(prev => prev + 1)
                return data;
            } else {
                toast.error(data.message);
                return  data;
            }

        } catch (error) {
            if (error instanceof Error){
                if (error.name === 'AbortError') {
                    console.error('Fetch aborted');
                } else {
                    console.error(error);
                    toast.error(error.message);
                }
                return { success: false, message: error.message }
            };
            return { success: false, message: 'Some Unknown Error Occured' }
        } finally {
            setLoading(false);
        }
    };

    return { createDocument, loading };
}
