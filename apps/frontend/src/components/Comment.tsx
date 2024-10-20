import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";

interface RenderCommentsProps {
    post: Post;
    comment_list: Comment[];
}

interface Comment {
    uid: string;
    commentId?: string;
    content: string;
    createdAt?: string;
    projectId: string;
}

interface Post {
    projectId: string;
    projectTitle: string;
    createdAt: string;
    projectDesc?: {
        description?: string;
        postImage?: string;
        postVideo?: string;
    };
    reactions?: {
        upvotes: number;
        downvotes: number;
    }[];
    user: UserInterface;
    comments: Comment[];
    totalUpvotes:number;
    totalDownvotes:number;
}

interface UserInterface {
    name: string;
    profilePic: string | null;
    userId: string;
}

interface PostReactionData {
    uid: string;
    upvotes: number;
    downvotes: number;
    projectId: string;
    user: UserInterface;
}

const API_URL = import.meta.env.VITE_API_URL;

const UpvoteIcon = ({ active }: { active: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke={active ? "blue" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-arrow-big-up size-6 ${
            active ? "text-blue-500" : "text-black dark:text-slate-200"
        }`}
    >
        <path d="M9 18v-6H5l7-7 7 7h-4v6H9z"></path>
    </svg>
);

const DownvoteIcon = ({ active }: { active: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke={active ? "blue" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-arrow-big-down size-6 ${
            active ? "text-blue-500" : "text-black dark:text-slate-200"
        }`}
    >
        <path d="M15 6v6h4l-7 7-7-7h4V6h6z"></path>
    </svg>
);

export default function Comment({ post, comment_list }: RenderCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(comment_list || []);
    const [hidden, setHidden] = useState(false);
    const [newCommentValue, setNewCommentValue] = useState("");

    const [upvote, setUpvote] = useState(false);
    const [downvote, setDownvote] = useState(false);
    const [totalUpvotes, setTotalUpvotes] = useState<number>(post.totalUpvotes || 0);
    const [totalDownvotes, setTotalDownvotes] = useState<number>(post.totalDownvotes || 0);
    const [userData, setUserData] = useState<PostReactionData | null>(null);

    const showComments = () => setHidden((prev) => !prev);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
        setNewCommentValue(e.target.value);

    useEffect(()=>{
        setTotalUpvotes(post.totalUpvotes || 0);
        setTotalDownvotes(post.totalDownvotes || 0);
        const fetchReactionDetails = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/v1/user/getPostReactionDetails`, {
                    uid: "iFaVSx", // Replace with Firebase token
                    projectId: post.projectId,
                });
                console.log(response.data)
                setUserData(response.data);
                const { upvotes, downvotes } = response.data;
                setUpvote(upvotes === 1);
                setDownvote(downvotes === 1);
            } catch (error) {
                console.error("Error fetching post reaction:", error);
            }
        };
        fetchReactionDetails();
    },[post])

    const handleUpvote = async () => {
        try {
            const newUpvote = !upvote;
            const newDownvote = false;
    
            if (newUpvote && downvote) {
                setTotalUpvotes(totalUpvotes + 1);
                setTotalDownvotes(totalDownvotes - 1);
            } else if (newUpvote) {
                setTotalUpvotes(totalUpvotes + 1);
            } else {
                setTotalUpvotes(totalUpvotes - 1);
            }
    
            setUpvote(newUpvote);
            setDownvote(newDownvote);
    
            await axios.post(`${API_URL}/api/v1/user/updateReaction`, {
                projectId: post.projectId,
                uid: "iFaVSx",
                upvote: newUpvote,
                downvote: newDownvote,
            });
        } catch (error) {
            console.error("Error updating reaction:", error);
        }
    };
    
    const handleDownvote = async () => {
        try {
            const newDownvote = !downvote;
            const newUpvote = false;
    
            if (newDownvote && upvote) {
                setTotalDownvotes(totalDownvotes + 1);
                setTotalUpvotes(totalUpvotes - 1);
            } else if (newDownvote) {
                setTotalDownvotes(totalDownvotes + 1);
            } else {
                setTotalDownvotes(totalDownvotes - 1);
            }
    
            setDownvote(newDownvote);
            setUpvote(newUpvote);
    
            await axios.post(`${API_URL}/api/v1/user/updateReaction`, {
                projectId: post.projectId,
                uid: "iFaVSx",
                upvote: newUpvote,
                downvote: newDownvote,
            });
        } catch (error) {
            console.error("Error updating reaction:", error);
        }
    };
    const sendComments = async () => {
        if (!newCommentValue) return;

        try {
            await axios.post(`${API_URL}/api/v1/user/addcomments`, {
                uid: "iFaVSx", // Replace with Firebase token
                content: newCommentValue,
                projectId: post.projectId,
            });

            const newComment: Comment = {
                uid: "iFaVSx",
                content: newCommentValue,
                projectId: post.projectId,
            };

            setComments((prev) => [...prev, newComment]);
            setNewCommentValue("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const renderUserAvatar = (user: UserInterface) => {
        console.log(`user`,user);
        const firstLetter = user.name.charAt(0).toUpperCase();
        return user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
        ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {firstLetter}
            </div>
        );
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4">

                <div onClick={() => handleUpvote()} className="cursor-pointer flex flex-row">
                    <UpvoteIcon active={upvote} />
                    <span className="text-sm font-medium">{totalUpvotes}</span>
                </div>

                <div onClick={() => handleDownvote()} className="cursor-pointe flex flex-rowr">
                    <DownvoteIcon active={downvote} />
                    <span className="text-sm font-medium">{totalDownvotes}</span>
                </div>

                <button onClick={showComments}>
                    {hidden ? "Hide Comments" : "Show Comments"}
                </button>
            </div>

            {hidden && (
                <div className="mt-4">
                    <div className="space-y-2">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={userData?.uid} className="flex flex-col">
                                    <div className="flex flex-row gap-3 ">
                                        {userData && renderUserAvatar(userData.user)}
                                        <div className="flex flex-col">
                                            <div className="text-sm">{userData?.user.name}</div>
                                            <div className="text-gray-400 text-xs">{`@${userData?.user.userId}`}</div>
                                        </div>
                                    </div>
                                    <div  className="p-2 border-b">
                                        <p className="text-sm">{comment.content}</p>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.createdAt ?? "").toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>

                    <div className="mt-4 text-xs gap-2 flex flex-row">
                        <input
                            type="text"
                            value={newCommentValue}
                            onChange={handleInputChange}
                            placeholder="Write your comment..."
                            className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
                        />
                        <button
                            onClick={sendComments}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}