import express from "express"
import Signup from "../controllers/Signup";
import getFeed from "../controllers/getFeed";
import createPost from "../controllers/Post/createPost";
import deletePost from "../controllers/Post/deletePost";
import updatePost from "../controllers/Post/updatePost";
import updateReactions from "../controllers/Post/updateReaction";
import addComment from "../controllers/Post/addComment";
import postReactionDetails from "../controllers/postReactionDetails";

const userRouter = express.Router();

//unprotectedRoutes

// signup route 
userRouter.post("/signup",Signup)
//get post
userRouter.post("/getFeed",getFeed);

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
//getUser's upvotes and personal details
userRouter.post("/getPostReactionDetails",postReactionDetails);

export default userRouter;