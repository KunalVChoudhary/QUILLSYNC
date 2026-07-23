import React from "react";

export const checkAuth = async (setUser: React.Dispatch<React.SetStateAction<string | null>>, setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>)=>{
    try{
        setAuthLoading(true);
        const response= await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/check`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (response.ok){
            const data = await response.json();
            setUser(data.username);
        } else{
            setUser(null);
        }
    } catch (error){
        console.error("Auth check failed:", error);
        setUser(null);
    } finally {
        setAuthLoading(false);
    }
}