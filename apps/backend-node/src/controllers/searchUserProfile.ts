import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function searchUserProfile(req:Request, res:Response){
    const { userId } = req.body;

    try{
        const userProfileData = await prisma.user.findUnique({
            where:{
                userId:userId
            },
            select:{
                userId:true,
                uid:true,
                name:true,
                posts:{
                    select:{
                        projectId: true,
                        projectTitle: true,
                        createdAt: true,
                        projectDesc:{
                            select:{
                                projectId:true,
                                description:true,
                                liveLink:true,
                                githubLink:true,
                                postImage:true,
                                postVideo:true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(
            userProfileData
        )

        if(!userProfileData){
            return res.status(404).json({
                msg:"no user posts found"
            })
        }
    }
    catch(error){
        console.log("error: " + error);
        res.status(500).json({
            msg:"internal server error"
        })
    }
}