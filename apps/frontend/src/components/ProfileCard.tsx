

const ProjectCard = ({ project }:any) => {
    const { projectTitle, projectDesc } = project;
    const { description, postImage, postVideo } = projectDesc;
  
    return (
      <div className="bg-slate-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6">
        {postImage && (
          <img
            src={postImage}
            alt={projectTitle}
            className="w-full h-64 object-cover"
          />
        )}
        {postVideo && (
          <video controls className="w-full h-64 ">
            <source src={postVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{projectTitle}</h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">{description}</p>
        </div>
      </div>
    );
  };
  
  const ProfileCard = ({projects}:any) => {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
        <h1 className="text-3xl font-extrabold text-center  mb-8">
          Posts Showcase
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project : any) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      </div>
    );
  };
  
  export default ProfileCard;