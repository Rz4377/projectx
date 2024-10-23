import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function searchUser(req:Request,res:Response){
    console.log("inside")
    const searchUser = req.body.searchedUser;
    console.log(searchUser);
    if(!searchUser){
        return res.status(400).json("search parameter is empty");
    }

    try{
        const users = await prisma.user.findMany({
            where:{
                OR:[
                    {
                        name: {
                            contains:searchUser,
                            mode: "insensitive"
                        }
                    },
                    {
                        userId: {
                            contains:searchUser,
                            mode: "insensitive"
                        }
                    }
                ]

            },
            select:{
                userId:true,
                uid:true,
                name:true
            }                
            
        })
        if(!users || users.length === 0){
            console.log("no users")
            return res.status(404).json({
                message:"no users found"
            })
        }
        return res.json(users);
    }
    catch(error){
        console.log("error searching users :" + error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}