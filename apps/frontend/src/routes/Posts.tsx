import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import Comment from "../components/Comment";
// import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";


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


//    const navigate = useNavigate();


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
                       <PostCard post={post}/>
                   ))
               )}
           </div>
       </div>
   );
}
