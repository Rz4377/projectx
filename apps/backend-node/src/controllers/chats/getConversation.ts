import prisma from "@repo/db";
import { Request, Response } from "express";

export async function getConversation(req: Request, res: Response) {
    const { uid, friendUid } = req.body;  // Both current user's uid and friend's uid are passed in the request

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderUid: uid, receiverUid: friendUid },   // User sent the message to the friend
                    { senderUid: friendUid, receiverUid: uid },   // Friend sent the message to the user
                ],
            },
            orderBy: {
                sentAt: 'desc',
            },
            take: 100,  // Limit to the last 100 messages
            select: {
                id: true,
                content: true,
                sentAt: true,
                sender: {
                    select: {
                        uid: true,
                        name: true,   // Fetch sender's name
                        userId: true, // Fetch sender's userId
                    },
                },
                receiver: {
                    select: {
                        uid: true,
                        name: true,   // Fetch receiver's name
                        userId: true, // Fetch receiver's userId
                    },
                },
            },
        });

        if (messages.length === 0) {
            return res.status(404).json({ message: "No messages found between these users" });
        }

        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}