import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function notifications(req: Request, res: Response) {
    console.log(req.body)
    const { uid: userUid } = req.body; 

    if (!userUid) {
        return res.status(400).json({ msg: "User UID is required." });
    }

    try {
        // Fetch the pending friend requests
        const friendRequests = await prisma.friendList.findMany({
            where: {
                friendUid: userUid,  // Fetch where the user is the one receiving the request
                ReqAccepted: false,  // Only get requests that are not accepted yet
            },
            select: {
                user: {
                    select: {
                        uid: true,
                        userId: true,
                        name: true,
                    },
                },
            },
        });

        // Handle no requests found case
        if (friendRequests.length === 0) {
            return res.status(404).json({ msg: "No pending friend requests found." });
        }

        // Return the friend request data
        return res.status(200).json({
            msg: "Friend requests retrieved successfully.",
            requests: friendRequests.map((request:any) => ({
                uid: request.user.uid,
                userId: request.user.userId,
                name: request.user.name,
            })),
        });
    } 
    catch (error) {
        console.error("Error retrieving friend requests:", error);

        return res.status(500).json({ 
            msg: "Internal server error. Please try again later.", 
        });
    } 
   
}