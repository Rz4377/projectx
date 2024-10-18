import prisma from "@repo/db";
import {Request , Response} from "express";
import { signupSchema } from "../validations/zodSchemas";

export default async function Signup(req:Request, res:Response){
    const {name ,uid , email , userId , profilePic } = req.body;
    const parseStatus = signupSchema.safeParse(req.body);

    if(!parseStatus.success){
        res.status(400).json({
            msg : "invalid inputs"
        })
        return ;
    }
    try{
        let foundUser = await prisma.user.findFirst({
            where:{
                uid
            }
        })

        if(!foundUser){
            try{
                const response = await prisma.user.create({
                    data: {
                        uid , 
                        name , 
                        email ,
                        userId,
                        profilePic
                    }
                })
                console.log(response);
                res.status(201).json({
                    msg :"user created successfully"
                })
            }
            catch(error){
                console.log(error)
                res.status(401).json({
                    msg : "unable to create user"
                })
            }
        }
        else{
            res.status(409).json({
                msg : "user already exists"
            })
        }
    }
    catch(error){
        res.status(500).json({
            msg :" internal server error"
        })
    }
}