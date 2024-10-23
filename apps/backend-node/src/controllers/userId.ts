import prisma from "@repo/db";
import { Request, Response } from "express";


export default async function UserId(req:Request , res:Response){
    const { userId } = req.body;
    try {
        let foundUserId = await prisma.user.findUnique({
            where: {
                userId: userId, 
            },
        });

        if (foundUserId) {
            return res.status(200).json({ message: "User ID already exists", exists: true });
        } else {
            return res.status(200).json({ message: "User ID is available", exists: false });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}