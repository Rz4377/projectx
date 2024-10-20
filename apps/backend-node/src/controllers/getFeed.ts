import prisma from "@repo/db";
import {Request , Response} from "express";

export default async function getFeed(req:Request, res:Response){
    const { projectRelated , search} = req.body;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

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
                projectDesc:true,
                reactions: true, 
                user:{
                    select:{
                        uid:true,
                        name:true,
                        profilePic:true,
                        userId:true,
                    }
                },
                comments:true
            },
            skip,
            take:limit
        })

        const postsWithReactionCount = response.map((post) => {
            const { upvotes, downvotes } = post.reactions.reduce(
                (acc, reaction) => {
                    acc.upvotes += reaction.upvotes;
                    acc.downvotes += reaction.downvotes;
                    return acc;
                },
                { upvotes: 0, downvotes: 0 }
            );

            return {
                ...post,
                totalUpvotes: upvotes,
                totalDownvotes: downvotes,
            };
        });

        const sortedPosts = postsWithReactionCount.sort(
            (a, b) => b.totalUpvotes - a.totalUpvotes
        );
        res.status(200).json({
            posts:postsWithReactionCount
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