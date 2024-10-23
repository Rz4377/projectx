import prisma from "@repo/db";
import { Request, Response } from "express";

interface FriendshipType {
    user: {
        uid: string;
        userId:string;
        name: string;
    };
    friend: {
        uid: string;
        userId:string;
        name: string;
    };
  }

export default async function getFriendList(req: Request, res: Response) {
    console.log(req.body);
    const { uid:userUid } = req.body; 

    if (!userUid) {
        return res.status(400).json({ msg: "uid is required." });
    }

    try {
        const friendList = await prisma.friendList.findMany({
        where: {
            OR: [
            { userUid },         
            { friendUid: userUid } 
            ],
            ReqAccepted: true 
        },
        select: {
            user: {
                select: {
                    uid: true,
                    userId: true,
                    name: true
                }
            },
            friend: {
                select: {
                    uid: true,
                    userId:true,
                    name: true
                }
            }
          }
        });

        if (!friendList || friendList.length === 0) {
        return res.status(404).json({ msg: "No friends found." });
        }

        const formattedFriends = friendList.map((friendship: FriendshipType) => {
            if (friendship.user.uid === userUid) {
                return {
                    friendId: friendship.friend.userId,
                    friendUid: friendship.friend.uid,
                    friendName: friendship.friend.name
                };
                } else {
                return {
                    friendId: friendship.user.userId,
                    friendUid: friendship.user.uid,
                    friendName: friendship.user.name
                };
                }
          });

        return res.status(200).json(formattedFriends);
    } catch (error) {
        console.error("Error retrieving friend list: ", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
}