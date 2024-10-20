import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";

export default function Logout(){
    const navigate = useNavigate();
    const handleLogout = () =>{
        signOut(auth).then(()=>{
            console.log("user signed out")
        }).catch((error)=>
            console.log(`error : ${error}`)
        )
        navigate("/home")
    }
    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
        >
            Logout
        </button>
    )
}