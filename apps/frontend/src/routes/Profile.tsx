import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import PostCard from "../components/PostCard";
import { getAuth } from "firebase/auth";
import SendFriendReq from "./SendFriendReq";

interface ProjectDescType {
  description: string;
  liveLink?: string;
  githubLink?: string;
  postImage?: string;
  postVideo?: string;
}

interface PostType {
  projectId: string;
  projectTitle: string;
  projectRelated: boolean;
  projectDesc: ProjectDescType;
}

interface UserProfile {
  name: string;
  uid: string;
  profilePic?: string;
  userId: string;
}

interface ProfileData {
  user: UserProfile;
  posts: PostType[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      try {
        const idToken = await currentUser?.getIdToken();
        const response = await axios.get(`${API_URL}/api/v1/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (response && response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        setError("Internal server error or network issue");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, [userId]);

 

  const handleUnfollow = async () => {
    try {
      const idToken = await currentUser?.getIdToken();
      await axios.post(
        `${API_URL}/api/v1/user/unfollow`,
        { friendUid: profileData?.user.uid },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      // Update the isFollowing status
      setProfileData((prevData) =>
        prevData ? { ...prevData, isFollowing: false } : prevData
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-gray-900 bg-gray-100 w-screen h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error || !profileData) {
    return <div>Error: {error || "Failed to load profile data."}</div>;
  }

  const { user, posts, followersCount, followingCount, isFollowing } = profileData;

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-100 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8">
      {user.profilePic ? (
        <img
            src={user.profilePic}
            alt={`${user.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover"
        />
        ) : (
        <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
            </span>
        </div>
        )}
        <h1 className="text-2xl mt-4">{user.name}</h1>
        <p>@{user.userId}</p>
        <div className="flex space-x-4 mt-4">
          <div>
            <strong>{posts.length}</strong> Posts
          </div>
          <div>
            <strong>{followersCount}</strong> Followers
          </div>
          <div>
            <strong>{followingCount}</strong> Following
          </div>
        </div>
        {currentUser?.uid !== user.uid && (
          <div className="mt-4">
            {isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Unfollow
              </button>
            ) : (
                <SendFriendReq friendUid={profileData.user.uid}/>
            )}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {posts.map((post) => (
          <PostCard key={post.projectId} post={post} />
        ))}
      </div>
    </div>
  );
}