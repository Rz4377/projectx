import axios from "axios";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { Spinner } from "../components/Spinner";

interface SendReqPropsType {
    friendUid: string;
}

export default function SendFriendReq({ friendUid }: SendReqPropsType) {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false); 
    const [isRequestSent, setIsRequestSent] = useState(false); 

    const handleSendReq = async () => {
        setError(null);
        setLoading(true);

        const auth = getAuth();
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) {
            setError("You are unauthorized");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/sendFriendReq",
                {
                    friendUid,
                    uid: "srgq04V6D3gxvWkyPJ405lXfpht2", // for devlopment purposes
                },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            if (response.status === 200) {
                setIsRequestSent(true); // Disable the button when request is successful
            }
        } catch (error: any) {
            console.log(error);
            if (error.status === 401) {
                setError("Request already sent");
            } else {
                setError("Cannot send request");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000); // 3 seconds before dismissing the error


            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="flex flex-col">
            <button
                onClick={handleSendReq}
                disabled={loading || isRequestSent}
                className={`px-4 py-2 font-semibold rounded-md shadow transition-all duration-300
                ${isRequestSent ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 dark:bg-blue-700 dark:hover:bg-blue-800"}
                text-white`}
            >
                {isRequestSent ? "Request Sent" : "Add Friend"}
            </button>

            {loading && <div className="text-blue-500 mt-2"><Spinner/></div>}

            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
}