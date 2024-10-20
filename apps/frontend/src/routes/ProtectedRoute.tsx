import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContextApi";
import { Spinner } from "../components/Spinner";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element; 
  }
export default function ProtectedRoute({children}:ProtectedRouteProps){
    const navigate = useNavigate();
    const authContextVal = useContext(AuthContext);
    if (!authContextVal) {
        throw new Error("AuthContext must be used within an AuthProvider.");
    }
    const {user , loading} = authContextVal;

    useEffect(()=>{
        if(!loading && !user){
            navigate("/signup")
        }
    },[loading , user , navigate])

    if(loading){
        return(
            <>
                <div className="text-center py-4"><Spinner /></div>
            </>
        )
    }
    
    if (user) {
        return children; 
    }

    return null;
}