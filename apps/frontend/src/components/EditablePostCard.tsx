// EditablePostCard.tsx
import { useState } from "react";
import { useDarkMode } from "../components/theme-provider";
import ImageWithLoader from "../components/ImageWithLoader";
import VideoWithLoader from "../components/VideoWithLoader";

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
  projectDesc: ProjectDescType;
}

interface EditablePostCardProps {
  post: PostType;
  onUpdate: (updatedPost: PostType) => void;
  onDelete: (projectId: string) => void;
}

export default function EditablePostCard({
  post,
  onUpdate,
  onDelete,
}: EditablePostCardProps) {
  const { isDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState<PostType>(post);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in updatedPost) {
      setUpdatedPost({ ...updatedPost, [name]: value });
    } else if (name in updatedPost.projectDesc) {
      setUpdatedPost({
        ...updatedPost,
        projectDesc: { ...updatedPost.projectDesc, [name]: value },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedPost);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(post.projectId);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`border rounded-lg p-6 mb-6 shadow-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {isEditing ? (
            <input
              type="text"
              name="projectTitle"
              value={updatedPost.projectTitle}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            />
          ) : (
            post.projectTitle
          )}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md text-white font-bold ${
              isEditing
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mb-4 p-4 border rounded-md bg-red-100 dark:bg-red-200">
          <p className="mb-4 text-red-800">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {/* Description Field */}
          <div className="mb-4">
            <label className="font-semibold">Description:</label>
            <textarea
              name="description"
              value={updatedPost.projectDesc.description}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              rows={4}
            />
          </div>

          {/* GitHub Link Field */}
          <div className="mb-4">
            <label className="font-semibold">GitHub Link:</label>
            <input
              type="text"
              name="githubLink"
              value={updatedPost.projectDesc.githubLink || ""}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            />
          </div>

          {/* Live Link Field */}
          <div className="mb-4">
            <label className="font-semibold">Live Link:</label>
            <input
              type="text"
              name="liveLink"
              value={updatedPost.projectDesc.liveLink || ""}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            />
          </div>

          {/* Image URL Field */}
          <div className="mb-4">
            <label className="font-semibold">Image URL:</label>
            <input
              type="text"
              name="postImage"
              value={updatedPost.projectDesc.postImage || ""}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            />
          </div>

          {/* Video URL Field */}
          <div className="mb-4">
            <label className="font-semibold">Video URL:</label>
            <input
              type="text"
              name="postVideo"
              value={updatedPost.projectDesc.postVideo || ""}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full mt-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            />
          </div>

          {/* Save Changes Button */}
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <>
          <p className="mb-4">{post.projectDesc.description}</p>

          {post.projectDesc.githubLink && (
            <div className="mb-4">
              <label className="font-semibold">GitHub Link:</label>
              <input
                className={`border p-2 rounded-md w-full mt-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                value={post.projectDesc.githubLink}
                readOnly
              />
            </div>
          )}

          {post.projectDesc.liveLink && (
            <div className="mb-4">
              <label className="font-semibold">Live Link:</label>
              <input
                className={`border p-2 rounded-md w-full mt-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                value={post.projectDesc.liveLink}
                readOnly
              />
            </div>
          )}

          {post.projectDesc.postImage && (
            <div className="mb-4">
              <ImageWithLoader
                src={post.projectDesc.postImage}
                alt={post.projectTitle}
              />
            </div>
          )}

          {post.projectDesc.postVideo && (
            <div className="mb-4">
              <VideoWithLoader
                src={post.projectDesc.postVideo}
                poster={post.projectDesc.postImage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}