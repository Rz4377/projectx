import prisma from "@repo/db";
import { Request, Response } from "express";
import { deleteFriendFromList } from "./deleteFriendFromList";

export default async function updateFriendReq(req: Request, res: Response) {
  const { uid:userUid, friendUid, accept } = req.body;

  // Validation of incoming data
  if (!userUid || !friendUid || accept === undefined) {
    return res.status(400).json({ msg: "userUid, friendUid, and accept fields are required." });
  }

  try {
    console.log(userUid , friendUid , accept);
    const friendRequest = await prisma.friendList.findFirst({
      where: {
        userUid: friendUid,  
        friendUid: userUid,
        ReqAccepted: false, 
      }
    });

    if (!friendRequest) {
      return res.status(404).json({ msg: "Friend request not found or already accepted/rejected." });
    }

    if (accept) {
      const updatedFriendRequest = await prisma.friendList.update({
        where: { id: friendRequest.id },
        data: { ReqAccepted: true }, 
      });

      return res.status(200).json({
        msg: "Friend request accepted.",
        updatedFriendRequest,
      });
    } 
    else {
      const deleted = await deleteFriendFromList(userUid, friendUid);
      if (deleted) {
        return res.status(200).json({ msg: "Friend request rejected and removed." });
      } else {
        return res.status(500).json({ msg: "Failed to delete the friend request." });
      }
    }
  } 
  catch (error) {
    console.error("Error updating friend request: ", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
}