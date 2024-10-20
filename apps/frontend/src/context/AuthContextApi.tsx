import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import {auth} from "../firebase/firebaseConfig";

interface AuthContextType  {
    user: string|null,
    loading:boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}):JSX.Element{
    const [user , setUser] = useState<string | null>(null);
    const [loading , setLoading] = useState(true);
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const uid = currentUser.uid;
                setUser(uid)
            }
            else{
                setUser(null)
            }
            setLoading(false)
        });
        return () => unsubscribe();
    },[])
    return (
        <AuthContext.Provider value={{user,loading}}>
            {children}
        </AuthContext.Provider>
    )
}


