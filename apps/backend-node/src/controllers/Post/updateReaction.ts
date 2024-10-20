import prisma from "@repo/db";
import { Request, Response } from "express";
import { updateReactionSchema } from "../../validations/zodSchemas";

export default async function updateReactions(req: Request, res: Response) {
    const { projectId, uid, upvote, downvote } = req.body;
    const schemaCheck = updateReactionSchema.safeParse(req.body);

    if(!schemaCheck.success){
        console.log("error: zod invalid")
        res.status(400).json({
            msg : "invalid inputs",
        })
        return ;
    }
        
    try {
        const existingReaction = await prisma.postReaction.upsert({
            where: {
                projectId_uid: { projectId, uid }, 
            },
            update: {
                upvotes: upvote ?1 : 0,
                downvotes: downvote ?1:0
            },
            create: {
                projectId,
                uid,
                upvotes: upvote ? 1 : 0,
                downvotes: downvote ? 1 : 0,
            },
        });
        console.log("vote updated successfully")
        res.status(200).json({
        msg: "Vote updated successfully",
        reaction: existingReaction,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}