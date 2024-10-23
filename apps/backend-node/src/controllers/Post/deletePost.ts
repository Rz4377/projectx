import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function deletePost(req: Request, res: Response) {
  const uid = req.body.uid; // Get uid from authentication middleware implement this later 
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ msg: "Project ID is required" });
  }

  try {
    // Find the post
    const post = await prisma.post.findUnique({
      where: { projectId },
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.uid !== uid) {
      return res.status(403).json({
        msg: "You are not authorized to delete this post",
      });
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        projectId,
      },
    });

    res.status(200).json({
      msg: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
}