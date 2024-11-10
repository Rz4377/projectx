import express from "express"
import Signup from "../controllers/Signup";
import getFeed from "../controllers/getFeed";
import createPost from "../controllers/Post/createPost";
import deletePost from "../controllers/Post/deletePost";
import updatePost from "../controllers/Post/updatePost";
import updateReactions from "../controllers/Post/updateReaction";
import addComment from "../controllers/Post/addComment";
import postReactionDetails from "../controllers/postReactionDetails";

import searchUser from "../controllers/searchUser";
import sendFriendRequest from "../controllers/friendReq/sendFriendRequest";
import updateFriendReq from "../controllers/friendReq/updateFriendReq";
import getFriendList from "../controllers/friendReq/getFriendList";
import { getConversation } from "../controllers/chats/getConversation";
import notifications from "../controllers/friendReq/notifications";
import UserId from "../controllers/userId";
import { upload } from "../controllers/upload";
import userPost from "../controllers/userPost";
import getProfile from "../controllers/getProfile";
import authenticationMiddleware from "../middlewares/authMiddleware";

const userRouter = express.Router();

//unprotectedRoutes

// signup route 
userRouter.post("/signup",Signup)
//get post
userRouter.post("/getFeed",getFeed);
//userId 
userRouter.post("/userId", UserId);

// protected route 

//user Post 
userRouter.get("/userPost/:uid" ,userPost)

userRouter.get("/health",(req,res)=>{
    res.status(200).json({
        msg :"ok"
    })
})

//create post
userRouter.post("/createPost",upload.fields([{ name: 'imageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }]),authenticationMiddleware,createPost);

// Update Post
userRouter.put("/updatePost/:projectId",authenticationMiddleware, updatePost);

// Delete Post
userRouter.delete("/deletePost/:projectId",authenticationMiddleware , deletePost);

//create or update reactions
userRouter.post("/updateReaction",authenticationMiddleware,updateReactions);

//add comments
userRouter.post("/addcomments",authenticationMiddleware,addComment);

//getUser's upvotes and personal details
userRouter.post("/getPostReactionDetails",authenticationMiddleware,postReactionDetails);


//searchUser
userRouter.post("/searchUser",searchUser);

//send friendReq
userRouter.post("/sendFriendReq",authenticationMiddleware,sendFriendRequest);

//update friendReq
userRouter.post("/updateFriendRequest",authenticationMiddleware,updateFriendReq);

//get friendList
userRouter.post("/getFriendList",authenticationMiddleware,getFriendList);

//get ConversationList
userRouter.post("/getUserConversation",authenticationMiddleware,getConversation);

//notifications
userRouter.post("/getnotifications",authenticationMiddleware,notifications);

userRouter.get("/profile/:userId",getProfile);

export default userRouter;