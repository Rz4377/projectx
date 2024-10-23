import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import Comment from "../components/Comment";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;


interface Comment {
   uid: string;
   commentId: string;
   content: string;
   createdAt: string;
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
   user: {
       uid: string;
       name: string;
       profilePic: string | null;
       userId: string;
   };
   comments: Comment[];
   totalUpvotes: number;
   totalDownvotes: number;
}


export default function Posts() {
   const [searchQuery, setSearchQuery] = useState("");
   const [loading, setLoading] = useState(true);
   const [projectRelated, setProjectRelated] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [posts, setPosts] = useState<Post[]>([]);


   const navigate = useNavigate();


   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
       setSearchQuery(e.target.value);
   };


   const toggleProjectRelated = () => {
       setProjectRelated((prev) => !prev);
   };




   useEffect(() => {
       const fetchPosts = async (pageNumber: number) => {
           setLoading(true);
           try {
               const response = await axios.post(
                   `${API_URL}/api/v1/user/getFeed?page=${pageNumber}&limit=10`,
                   {
                       projectRelated,
                       search: searchQuery,
                   }
               );
               setPosts(response.data.posts);
           } catch (err) {
               console.error(err);
               setError("Failed to fetch posts");
           } finally {
               setLoading(false);
           }
       };


       fetchPosts(1);
   }, [searchQuery, projectRelated]);


   const renderUserAvatar = (user: Post["user"]) => {
       if (user.profilePic) {
           return (
               <img
                   className="w-10 h-10 rounded-full"
                   src={user.profilePic}
                   alt={`${user.name}'s profile`}
               />
           );
       }
       const firstLetter = user.name.charAt(0).toUpperCase();
       return (
           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
               {firstLetter}
           </div>
       );
   };


   return (
       <div className="dark:bg-gray-900 flex justify-center min-h-screen">
           <div className="max-w-md w-full">
               {/* Search and Toggle Controls */}
               <form className="mb-6">
                   <input
                       type="search"
                       className="block w-full p-4 pl-10 dark:bg-gray-900 dark:text-white text-sm border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Search posts by title or description..."
                       value={searchQuery}
                       onChange={handleSearch}
                   />
               </form>


               <label className="inline-flex items-center mb-4 cursor-pointer">
                   <input
                       type="checkbox"
                       checked={projectRelated}
                       onChange={toggleProjectRelated}
                       className="sr-only peer"
                   />
                   <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                   <span className="ml-3 text-sm font-medium dark:text-white">
                       {projectRelated ? "Project-Related Posts" : "All Posts"}
                   </span>
               </label>


               {error ? (
                   <div className="text-red-500">{error}</div>
               ) : loading ? (
                   <Spinner />
               ) : (
                   posts.map((post) => (
                       <div
                           key={post.projectId}
                           className="mb-8 p-4 bg-white rounded-md shadow-md dark:bg-gray-800 dark:text-white"
                       >
                           {/* User Info and Post Title */}
                           <div onClick={()=> navigate(`/profile/${post.user.userId}`)} className="flex items-center gap-4 hover:cursor-pointer">
                               {renderUserAvatar(post.user)}
                               <div>
                                   <h2 className="text-lg font-bold">{post.user.name}</h2>
                                   <span className="text-sm text-gray-400">
                                       @{post.user.userId}
                                   </span>
                               </div>
                           </div>


                           {/* Post Content */}
                           {post.projectTitle && (
                               <p className="mt-4 text-sm">{post.projectTitle}</p>
                           )}
                           {post.projectDesc?.description && (
                               <p className="mt-4 text-sm">{post.projectDesc.description}</p>
                           )}
                           {post.projectDesc?.postImage && (
                               <img
                                   src={post.projectDesc.postImage}
                                   alt="loading..."
                                   className="rounded-lg mt-2"
                               />
                           )}
                           {post.projectDesc?.postVideo && (
                               <video
                                   src={post.projectDesc.postVideo}
                                   controls
                                   className="rounded-lg mt-2"
                               />
                           )}


                           {/* Comment and Reactions Section */}
                           <div className="flex gap-6 mt-4">
                               <Comment post={post} comment_list={post.comments} />
                           </div>
                       </div>
                   ))
               )}
           </div>
       </div>
   );
}
