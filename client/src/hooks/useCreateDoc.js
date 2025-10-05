import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth"

export default function useCreateDoc() {
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const { setReloader } = useAuth()

    useEffect(() => {
        // On component unmount, abort the request
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const createDocument = async (formData) => {
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
                signal: abortControllerRef.current.signal,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Document Created Successfully');
                return { success: true, data };
            } else {
                toast.error(data.message);
                return { success: false, error: data.message };
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Fetch aborted');
            } else {
                console.error(error);
                toast.error(error.message);
            }
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
            setReloader(prev=>prev+1)
        }
    };

    return { createDocument, loading };
}
