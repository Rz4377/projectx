import { useNavigate } from "react-router-dom";
import Comment from "./Comment";

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

// interface PostProp {
//   post: Post
// }

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

export default function PostCard({post}:any) {
  const navigate = useNavigate();
  return (
    <>
      <div
        key={post.projectId}
        className="mb-8 p-4 bg-white rounded-md shadow-md dark:bg-gray-800 dark:text-white"
      >
        {/* User Info and Post Title */}
        <div onClick={() => navigate(`/profile/${post.user.userId}`)} className="flex items-center gap-4 hover:cursor-pointer">
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
          <p className="mt-4 font-semibold text-md">{post.projectTitle}</p>
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
    </>
  )
}