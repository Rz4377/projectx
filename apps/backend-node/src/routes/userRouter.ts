import express from "express"
import Signup from "../controllers/Signup";
import getFeed from "../controllers/getFeed";
import createPost from "../controllers/Post/createPost";
import deletePost from "../controllers/Post/deletePost";
import updatePost from "../controllers/Post/updatePost";
import updateReactions from "../controllers/Post/updateReaction";
import addComment from "../controllers/Post/addComment";

const userRouter = express.Router();

//unprotectedRoutes

// signup route 
userRouter.post("/signup",Signup)
//get post
userRouter.get("/getFeed",getFeed);

// protected route 

//create post
userRouter.post("/createPost",createPost);
//update post
userRouter.post("/updatePost",updatePost);
//delete post
userRouter.post("/deletePost",deletePost);
//create or update reactions
userRouter.post("/updateReaction",updateReactions);
//add comments
userRouter.post("/addcomments",addComment);

export default userRouter;