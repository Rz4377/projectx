import prisma from "@repo/db";
import { Request, Response } from "express";
import { updateSchema } from "../../validations/zodSchemas";

export default async function updatePost(req: Request, res: Response) {
    console.log(req.body);
  const uid = req.body.uid; // adjust it later
  const { projectId } = req.params;
  const { projectTitle, projectRelated, projectDesc } = req.body;

  const parseStatus = updateSchema.safeParse(req.body);

  if (!parseStatus.success) {
    console.log("error: zod invalid");
    res.status(400).json({
      msg: "invalid inputs",
    });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { projectId },
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.uid !== uid) {
      return res.status(403).json({
        msg: "You are not authorized to update this post",
      });
    }

    const response = await prisma.post.update({
      where: {
        projectId,
      },
      data: {
        projectTitle,
        projectRelated,
        projectDesc: {
          upsert: {
            create: {
              description: projectDesc.description,
              liveLink: projectDesc.liveLink,
              githubLink: projectDesc.githubLink,
              postImage: projectDesc.postImage,
              postVideo: projectDesc.postVideo,
            },
            update: {
              description: projectDesc.description,
              liveLink: projectDesc.liveLink,
              githubLink: projectDesc.githubLink,
              postImage: projectDesc.postImage,
              postVideo: projectDesc.postVideo,
            },
          },
        },
      },
    });
    console.log(response);
    res.status(200).json({
      msg: "post updated successfully",
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(500).json({
      msg: "internal server error",
    });
  }
}