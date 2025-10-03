import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('quillsyncApp');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser)?.user : null );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

