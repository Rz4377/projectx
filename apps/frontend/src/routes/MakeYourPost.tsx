// MakeYourPost.tsx
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MakeYourPost() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [liveLink, setLiveLink] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const auth = getAuth();
  const navigate = useNavigate();

  // Handle file drop for images/videos
  const handleFileDrop = (
    event: React.DragEvent<HTMLDivElement>,
    type: "image" | "video"
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (type === "image") {
      if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert(`Please drop a valid image file (PNG or JPEG).`);
      }
    } else if (type === "video") {
      if (file && (file.type === "video/mp4" || file.type === "video/webm")) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert(`Please drop a valid video file (MP4 or WebM).`);
      }
    }
  };

  // Handle file upload from folder
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      if (
        type === "image" &&
        (file.type === "image/png" || file.type === "image/jpeg")
      ) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else if (
        type === "video" &&
        (file.type === "video/mp4" || file.type === "video/webm")
      ) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert(`Please select a valid ${type} file.`);
      }
    }
  };

  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (title.trim() === "" || description.trim() === "") {
        alert("Please fill the mandatory fields.");
        setIsSubmitting(false);
        return;
      }

      // doing this to validate URLs
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // Protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // Domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // Port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // Query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      if (github && !urlPattern.test(github)) {
        alert("Please enter a valid GitHub URL.");
        setIsSubmitting(false);
        return;
      }
      if (liveLink && !urlPattern.test(liveLink)) {
        alert("Please enter a valid live link URL.");
        setIsSubmitting(false);
        return;
      }

      const idToken = (await auth.currentUser?.getIdToken()) || null;
      console.log(idToken)

      if (idToken) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("github", github);
        formData.append("liveLink", liveLink);

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        if (videoFile) {
          formData.append("videoFile", videoFile);
        }

        await axios.post(
          `https://api.tallentgallery.online/api/v1/user/createPosts`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSuccess(true);

        setTimeout(() => {
          navigate("/feed");
        }, 2000);
      } else {
        throw new Error("idToken not defined");
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      setError("Failed to create post. make sure you have no duplicate title present.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to remove the selected file
  const removeFile = (type: "image" | "video") => {
    if (type === "image") {
      setImageFile(null);
      setImagePreview("");
    } else if (type === "video") {
      setVideoFile(null);
      setVideoPreview("");
    }
  };

  // Function to open preview in a new tab
  const openPreview = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full  h-full pt-8 px-2">
        <div  className="max-w-3xl flex items-center justify-center ">
            <form
                onSubmit={handleCreatePost}
                className="flex flex-col space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full"
            >
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Create a New Post
                </h1>

                <input
                className="border-2 p-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Project title"
                required
                disabled={isSubmitting}
                />
                <input
                className="border-2 p-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Project description"
                required
                disabled={isSubmitting}
                />
                <input
                className="border-2 p-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setGithub(e.target.value)}
                type="text"
                placeholder="Project GitHub link (optional)"
                disabled={isSubmitting}
                />
                <input
                className="border-2 p-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setLiveLink(e.target.value)}
                type="text"
                placeholder="Project live link (optional)"
                disabled={isSubmitting}
                />

                {/* Drag and Drop Image */}
                <div
                onDrop={(event) => handleFileDrop(event, "image")}
                onDragOver={(event) => event.preventDefault()}
                className="border-2 border-dashed border-gray-400 dark:border-gray-600 p-4 w-full text-center mt-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                >
                {imageFile ? (
                    <div className="flex items-center justify-between">
                    <p className="text-gray-700 dark:text-gray-300">
                        {imageFile.name}
                    </p>
                    <div className="flex space-x-2">
                        <button
                        type="button"
                        className="text-blue-500 underline"
                        onClick={() => openPreview(imagePreview)}
                        >
                        Show Preview
                        </button>
                        <button
                        type="button"
                        className="text-red-600"
                        onClick={() => removeFile("image")}
                        >
                        X
                        </button>
                    </div>
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                    Drag and drop an image here (PNG or JPEG)
                    </p>
                )}
                </div>

                {/* Image File Upload */}
                <input
                type="file"
                accept="image/png, image/jpeg"
                className="text-gray-700 dark:text-gray-300 mt-2"
                onChange={(e) => handleFileSelect(e, "image")}
                disabled={isSubmitting}
                />

                {/* Drag and Drop Video */}
                <div
                onDrop={(event) => handleFileDrop(event, "video")}
                onDragOver={(event) => event.preventDefault()}
                className="border-2 border-dashed border-gray-400 dark:border-gray-600 p-4 w-full text-center mt-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                >
                {videoFile ? (
                    <div className="flex items-center justify-between">
                    <p className="text-gray-700 dark:text-gray-300">
                        {videoFile.name}
                    </p>
                    <div className="flex space-x-2">
                        <button
                        type="button"
                        className="text-blue-500 underline"
                        onClick={() => openPreview(videoPreview)}
                        >
                        Show Preview
                        </button>
                        <button
                        type="button"
                        className="text-red-600"
                        onClick={() => removeFile("video")}
                        >
                        X
                        </button>
                    </div>
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                    Drag and drop a video here (MP4 or WebM)
                    </p>
                )}
                </div>

                {/* Video File Upload */}
                <input
                type="file"
                accept="video/mp4, video/webm"
                className="text-gray-700 dark:text-gray-300 mt-2"
                onChange={(e) => handleFileSelect(e, "video")}
                disabled={isSubmitting}
                />

                <button
                className="border-2 p-2 w-1/4 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
                >
                {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {/* Success Message */}
                {success && (
                <div className="text-green-600 mt-2">
                    Post created successfully! Redirecting to feed...
                </div>
                )}

                {/* Error Message */}
                {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
        </div>
    </div>
  );
}