import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner";
import SendFriendReq from "./SendFriendReq";

interface userType {
    uid:string,
    userId: string;
    name: string;
}

export default function AddFriend() {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [uid, setUid] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    useEffect(() => {
        setError(null);
        setLoading(true);
        const getUsersList = async () => {
            const auth = getAuth();
            const idToken = await auth.currentUser?.getIdToken();
            console.log(idToken)
            const currentUid = auth.currentUser?.uid;
            setUid(currentUid || ""); 
            if (!idToken) {
                setError("You are unauthorized");
                setLoading(false);
                return;
            }
            try {
                let response = await axios.post(
                    "http://localhost:3000/api/v1/user/searchUser",
                    {
                        searchedUser: searchQuery,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );
                setUsersList(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError("No users found");
                setLoading(false);
            }
        };
        getUsersList();
    }, [searchQuery]);

    return (
        <div className="flex flex-col w-full h-full dark:bg-gray-900 p-2 items-center">
            <div className="max-w-md w-full">
                <form className="mb-6">
                    <label htmlFor="default-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search user by name or userId..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </form>
                <>
                    {!loading ? (
                        <>
                            {error ? (
                                <div className="flex justify-center items-center text-red-500">{error}</div>
                            ) : (
                                <RenderUsers usersList={usersList} uid={uid} />
                            )}
                        </>
                    ) : (
                        <Spinner />
                    )}
                </>
            </div>
        </div>
    );
}

interface RenderUsersProps {
    usersList: userType[];
    uid: string;
}

function RenderUsers({ usersList, uid }: RenderUsersProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 p-2">
            {usersList.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {usersList
                        .filter((user: userType) => user.uid !== uid) 
                        .map((user: userType) => (
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
                                    <SendFriendReq friendUid={user.uid}/>
                                    
                                </div>
                            </li>
                        ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No user with this name
                </div>
            )}
        </div>
    );
}