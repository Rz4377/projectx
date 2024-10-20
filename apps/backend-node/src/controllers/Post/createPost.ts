import prisma from "@repo/db";
import {Request , Response} from "express";
import { postSchema } from "../../validations/zodSchemas";

export default async function createPost(req:Request, res:Response){
    const {projectTitle ,projectDesc , uid , projectRelated } = req.body;
    const parseStatus = postSchema.safeParse(req.body);

    if(!parseStatus.success){
        res.status(400).json({
            msg : "invalid inputs",
            errors: parseStatus.error.errors
        })
        return ;
    }

    try{
        const response = await prisma.post.create({
            data: {
                uid,
                projectTitle , 
                projectRelated,
                projectDesc: {
                    create: {
                        postImage: projectDesc.postImage,
                        postVideo: projectDesc.postVideo,
                        description: projectDesc.description,
                        githubLink: projectDesc.githubLink,
                        liveLink: projectDesc.liveLink,
                    }
                },
                comments:{
                    
                },
                reactions:{

                }
            }
        })
        console.log(response);
        res.status(201).json({
            msg :"post created successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            msg : "internal server error"
        })
    }
}