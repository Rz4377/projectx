import prisma from "@repo/db";
import {Request , Response} from "express";

export default async function getFeed(req:Request, res:Response){
    const { projectRelated , search} = req.body;

    try{
        const response = await prisma.post.findMany({
            where:{
                AND: [
                    { projectRelated }, 
                    {
                        OR: [
                            { projectTitle: { contains: search, mode: "insensitive" } },
                            {
                            projectDesc: {
                                description: { contains: search, mode: "insensitive" },
                            },
                            },
                        ],
                    },
                ],
            },
            include: {
                reactions: true, 
            }
        })

        const sortedPosts = response.sort((a, b) => {
            const upvotesA = a.reactions[0]?.upvotes ?? 0;
            const upvotesB = b.reactions[0]?.upvotes ?? 0;
            return upvotesB - upvotesA; 
        });
          
        console.log(sortedPosts);
        res.status(200).json({
            posts:response
        })
    }
    catch(error:any){
        console.log(error)
        if(error.code === "P2025") {
            return res.status(404).json({
              msg: "No post with this name",
            });
        }
        res.status(500).json({
            msg : "internal server error"
        })
    }
}