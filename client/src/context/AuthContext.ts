import { createContext } from "react";

export interface AuthContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    authLoading: boolean;
    reloader: number;
    setReloader: React.Dispatch<React.SetStateAction<number>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);