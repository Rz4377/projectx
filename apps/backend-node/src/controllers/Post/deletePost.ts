import prisma from "@repo/db";
import {Request , Response} from "express";
import { deleteSchema } from "../../validations/zodSchemas";

export default async function deletePost(req:Request, res:Response){
    const {projectId , uid} = req.body;
    const parseStatus = deleteSchema.safeParse(req.body);

    if(!parseStatus.success){
        res.status(400).json({
            msg : "invalid inputs",
            errors: parseStatus.error.errors
        })
        return ;
    }

    try{
        // step 1:
        const post = await prisma.post.findUnique({
            where: { projectId },
        });
      
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (post.uid !== uid) {
            return res.status(403).json({
                msg: "You are not authorized to delete this post",
            })
        }

        // step 2:
        const response = await prisma.post.delete({
            where:{
                projectId
            }
        })
        console.log(response);
        res.status(200).json({
            msg :"post deleted successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            msg : "internal server error"
        })
    }
}