import prisma from "@repo/db";
import { Request, Response } from "express";

export async function pendingFriendReq(req: Request, res: Response) {
    const { uid } = req.body;  

    try {
        const pendingRequests = await prisma.friendList.findMany({
            where: {
                friendUid: uid,   
                ReqAccepted: false 
            },
            select: {
                userUid: true,
                friendUid: true,
                friend: {  
                    select: {
                        name: true,
                        userId: true,
                    }
                }
            }
        });

        if (pendingRequests.length === 0) {
            return res.status(404).json({ message: "No pending friend requests" });
        }
        return res.status(200).json(pendingRequests);
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}