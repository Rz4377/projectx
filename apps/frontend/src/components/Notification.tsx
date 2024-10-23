import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner";
import { getAuth } from "firebase/auth";

interface UserType {
  uid: string;
  userId: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Notification() {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<UserType[]>([]);
  const [uid, setUid] = useState("");

  // Fetch friend requests notifications
  useEffect(() => {
        const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        const idToken = await  getAuth().currentUser?.getIdToken();

        const uid = getAuth().currentUser?.uid;
        if( !idToken || !uid ){
            return ;
        }
        setUid(uid);

        try {
            const response = await axios.post(
            `${API_URL}/api/v1/user/getnotifications`,
            { },{
                headers:{
                    Authorization:`Bearer ${idToken}`
                }
            }
            );

            if (response.data.requests && response.data.requests.length > 0) {
            setNotifications(response.data.requests);
            } else {
            setError("No pending friend requests found.");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("No notifications found.");
        } finally {
            setLoading(false);
        }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="flex flex-col w-full h-full dark:bg-gray-900 p-2 items-center">
        <div className="max-w-md w-full">
            {!loading ? (
            error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <RenderNotifications
                notifications={notifications}
                setNotifications={setNotifications}
                uid={uid}
                />
            )
            ) : (
            <Spinner />
            )}
        </div>
        </div>
    );
    }

    // Render the list of notifications
    interface RenderNotificationsProps {
    notifications: UserType[];
    setNotifications: React.Dispatch<React.SetStateAction<UserType[]>>;
    uid: string;
    }

    function RenderNotifications({ notifications, setNotifications }: RenderNotificationsProps) {
    const acceptFriendRequest = async (friendUid: string) => {
        try {

        const idToken = await getAuth().currentUser?.getIdToken();
        const response = await axios.post(`${API_URL}/api/v1/user/updateFriendRequest`, {
            friendUid: friendUid,
            accept: true,
        },{
            headers:{
                Authorization:`Bearer ${idToken}`
            }
        });

        alert(response.data.msg);

        // Remove the accepted request from the notifications list
        setNotifications((prevNotifications) =>
            prevNotifications.filter((user) => user.uid !== friendUid)
        );
        } catch (error) {
        console.error("Error accepting friend request:", error);
        }
    };

    const rejectFriendRequest = async (friendUid: string) => {
        try {
        const idToken = await getAuth().currentUser?.getIdToken();

        const response = await axios.post(`${API_URL}/api/v1/user/updateFriendRequest`, {
            friendUid: friendUid,
            accept: false,
        },{
            headers:{Authorization:`Bearer ${idToken}`}
        });

        alert(response.data.msg);

        // Remove the rejected request from the notifications list
        setNotifications((prevNotifications) =>
            prevNotifications.filter((user) => user.uid !== friendUid)
        );
        } catch (error) {
        console.error("Error rejecting friend request:", error);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 p-2">
        {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((user) => (
                <li key={user.uid} className="py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        {`@${user.userId}`}
                        </p>
                    </div>
                    </div>
                    <div className="flex space-x-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-full"
                        onClick={() => acceptFriendRequest(user.uid)}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded-full"
                        onClick={() => rejectFriendRequest(user.uid)}
                    >
                        Reject
                    </button>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
            No pending friend requests
            </div>
        )}
        </div>
    );
}