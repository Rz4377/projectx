import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function sendFriendRequest(req: Request, res: Response) {
  
  const { uid:userUid, friendUid } = req.body; 
    if (!userUid || !friendUid) {
        return res.status(400).json({
          msg: "Both uid and friendUid are required."
        });
    }
    if(userUid === friendUid){
      return res.status(400).json({
        msg:"cannot send request to yourself"
      })
    }
    try {
      const existingFriendship = await prisma.friendList.findFirst({
        where: {
          OR: [
            { userUid: userUid, friendUid: friendUid }, 
            { userUid: friendUid, friendUid: userUid }  
          ]
        }
      });

      if (existingFriendship) {
        return res.status(401).json({ msg: "Friend request already sent or you are already friends." });
      }

      const friendRequest = await prisma.friendList.create({
        data: {
          userUid: userUid,
          friendUid: friendUid,
          ReqAccepted: false, 
        }
      });
      return res.status(200).json({ msg: "Friend request sent successfully.", friendRequest });
    } 
    catch (error) {
      console.error("Error sending friend request: ", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
}