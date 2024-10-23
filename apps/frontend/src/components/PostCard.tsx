import React from "react";

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
  projectDesc: ProjectDescType | null; // Allow projectDesc to be null
}

interface PostCardProps {
  post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { projectDesc } = post;

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow">
      {projectDesc && projectDesc.postImage ? (
        <img
          src={projectDesc.postImage}
          alt={post.projectTitle}
          className="w-full h-48 object-cover rounded"
        />
      ) : (
        // Optional placeholder if no image
        <div className="w-full h-48 bg-gray-200 rounded"></div>
      )}
      <h2 className="text-xl mt-2">{post.projectTitle}</h2>
      <p className="mt-1">
        {projectDesc ? projectDesc.description : "No description available."}
      </p>
      {projectDesc && projectDesc.githubLink && (
        <a
          href={projectDesc.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 mt-2 block"
        >
          GitHub Link
        </a>
      )}
      {projectDesc && projectDesc.liveLink && (
        <a
          href={projectDesc.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 mt-1 block"
        >
          Live Link
        </a>
      )}
    </div>
  );
};

export default PostCard;