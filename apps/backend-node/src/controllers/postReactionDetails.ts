import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function postReactionDetails(req: Request, res: Response) {
    const { uid, projectId } = req.body;

    try {
        const response = await prisma.postReaction.findUnique({
            where: {
                projectId_uid: { projectId, uid }, 
            },
            select: {
                uid: true,
                upvotes: true,
                downvotes: true,
                projectId: true,
                user: {
                    select: {
                        name: true,
                        profilePic: true,
                        userId: true,
                    },
                },
            },
        });

        if (!response) {
            return res.status(404).json({ msg: "Reaction not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching post reaction:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}