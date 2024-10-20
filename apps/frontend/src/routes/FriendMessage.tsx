import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner";
import { useNavigate } from "react-router-dom";

interface friendType {
    friendId: string;
    friendUid: string;
    friendName: string;
}

export default function FriendMessage() {
    const [friendList, setFriendList] = useState<friendType[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<friendType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [displayError, setDisplayError] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const getFrndList = async () => {
            try {
                const auth = getAuth();
                const idToken = await auth.currentUser?.getIdToken();
                if (!idToken) {
                    setDisplayError("Unauthorized");
                    setLoading(false);
                    return;
                }
                const response = await axios.post(
                    "http://localhost:3000/api/v1/user/friendList",
                    { }, 
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );
                setFriendList(response.data);
                setFilteredFriends(response.data);
            } catch (error) {
                console.log("Error fetching friend list", error);
                setDisplayError("Your friendList is empty");
            } finally {
                setLoading(false);
            }
        };
        getFrndList();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = friendList.filter((friend) =>
            friend.friendName.toLowerCase().includes(query) ||
            friend.friendUid.toLowerCase().includes(query)
        );
        setFilteredFriends(filtered);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }

    if (displayError) {
        return <div className="text-center text-red-500">{displayError}</div>;
    }

    return (
        <div className="flex flex-col h-full dark:bg-gray-900 p-2">
            <div className="max-w-md w-full">
                {/* Search Form */}
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
                            placeholder="Search friends by name or userId..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </form>

                {/* Friend List */}
                <div className="bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 p-2">

                    {filteredFriends.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredFriends.map((friend) => (
                                <li key={friend.friendId} className="py-3 sm:py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                                                {friend.friendName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {friend.friendName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {`@${friend.friendId}`}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={()=> navigate(`/conversation?fid=${friend.friendUid}`)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition-all duration-300 dark:bg-blue-700 dark:hover:bg-blue-800">
                                            Message
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No friends found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}