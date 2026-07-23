import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { checkAuth } from "../hooks/useCheckAuth";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [reloader, setReloader] = useState(0);

    useEffect(() => {
        checkAuth(setUser, setAuthLoading);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, authLoading, reloader, setReloader }}
        >
            {children}
        </AuthContext.Provider>
    );
}