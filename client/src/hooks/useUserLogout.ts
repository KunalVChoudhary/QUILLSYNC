import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth"
import { toast } from "react-toastify";

type UserLoginResponse ={
        success: boolean,
        message: string,
    }

export default function useUserLogout(){
    const {setUser} = useAuth()
    const navigate = useNavigate();

    const logout = async (): Promise<void> =>{
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{
                method : 'GET',
                credentials: 'include'
            })
            const data: UserLoginResponse = await response.json()
            if (response.ok){
                toast.success(data.message)
                setUser(null)
                setTimeout(()=> navigate('/'),2000)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error('Error! Try Again')
        }
    }
    return {logout}
}