import prisma from "@repo/db";
import { Request, Response } from "express";
import { addComments } from "../../validations/zodSchemas";

export default async function addComment(req: Request, res: Response) {
    const { uid, content, projectId } = req.body;
    const schemaCheck = addComments.safeParse(req.body);

    if(!schemaCheck.success){
        console.log("error: zod invalid")
        res.status(400).json({
            msg : "invalid inputs",
        })
        return ;
    }
    try{
        const newComment = await prisma.comment.create({
        data:{
                uid,
                content,
                projectId
            }
        });
        
        console.log(newComment);
    
        res.status(201).json({
            msg : "comment added successfully",
            comment : newComment
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            msg : "internal server error"
        })
    }
}