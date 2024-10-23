import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function userPost(req:Request,res:Response){
    const userUid = req.params.uid;
    console.log(req.params.uid)

    if (typeof userUid !== 'string') {
        return res.status(400).json({ error: "Invalid uid" });
    }

    try{
        let response = await prisma.post.findMany({
            where:{
                uid:userUid
            },
            select: {
                projectId: true,        
                projectTitle: true,
                projectRelated:true,
                projectDesc: {         
                    select: {
                        description: true,
                        liveLink: true,
                        githubLink: true,
                        postImage: true,
                        postVideo: true
                    },
                },
            },
        });

        return res.status(200).json({
            response
        })
    }
    catch(error){

        return res.status(400).json({
            error:"request failed"
        })
    }
}