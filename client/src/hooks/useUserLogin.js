import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export default function useUserLogin(){
    const [loading, setLoading] = useState(false)
    const {user, setUser} = useAuth()
    const navigate = useNavigate();

    const loginUser = async (purpose,loginData)=>{
        setLoading(true)
        try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${(purpose === 'Sign Up')? 'register' : 'login'}`,{
            method : 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        })
        const data = await response.json()
        if (response.ok){
            toast.success(data.message)
            localStorage.setItem('quillsyncApp',JSON.stringify({'user':data.username}))
            setUser(data.username)
            setTimeout(()=> navigate('/'),2000)
        } else if (response.status===400){
            toast.error(data.message)
        } else {
            toast.error(data.message)
        }}
        catch(error){
            toast.error('Error! Try Again')
        }
        finally{
            setLoading(false)
        }
    }

    return { loginUser, loading, user };

}