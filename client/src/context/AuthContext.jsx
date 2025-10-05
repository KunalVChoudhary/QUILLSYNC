import { createContext, useState, useEffect  } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [reloader, setReloader] = useState(0)

  const checkAuth = async()=>{
    try{
      const response =  await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check`,{
      method:'GET',
      credentials:'include'
      })
      if (response.ok){
        const data = await response.json()
        setUser(data.username)
      }else{
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null)
    } finally{
      setAuthLoading(false)
    }
  }

  //call check auth in useEffect and set tge user value to it 
  useEffect(()=>{
    checkAuth()
  },[])

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, reloader, setReloader }}>
      {children}
    </AuthContext.Provider>
  );
}

