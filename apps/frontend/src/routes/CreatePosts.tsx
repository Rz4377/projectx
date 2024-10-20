import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContextApi";
import { useNavigate } from "react-router-dom";
import MakeYourPost from "./MakeYourPost";
import { Spinner } from "../components/Spinner"; 

export default function CreatePosts() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("authContext is undefined");
  }

  const { user, loading } = authContext;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signup");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <MakeYourPost />;
  }

  return null;
}