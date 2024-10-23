import { Request, Response } from "express";
import { deleteFriendFromList } from "./deleteFriendFromList";


export default async function unfriendRequest(req: Request, res: Response) {
  const { uid:userUid, friendUid } = req.body;

  if (!userUid || !friendUid) {
    return res.status(400).json({ msg: "Both userId and friendId are required." });
  }

  try {
    const deleted = await deleteFriendFromList(userUid, friendUid);

    if (deleted) {
      return res.status(200).json({ msg: "Friend removed successfully." });
    } else {
      return res.status(404).json({ msg: "Friendship not found." });
    }
  } catch (error) {
    console.error("Error removing friend: ", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
}