import prisma from "@repo/db";
import { Request, Response } from "express";
import { postSchema } from "../../validations/zodSchemas";

export default async function createPost(req: Request, res: Response) {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    // Extract image and video URLs from uploaded files
    if (req.files && (req.files as any)['imageFile']) {
        imageUrl = ((req.files as any)['imageFile'][0] as any).location;
    }

    if (req.files && (req.files as any)['videoFile']) {
        videoUrl = ((req.files as any)['videoFile'][0] as any).location;
    }
    console.log('imageUrl:', imageUrl, 'videoUrl:', videoUrl);

    const { projectTitle, projectDesc, uid, projectRelated } = req.body;

    // Parse projectDesc from JSON string
    let projectDescObj;
    try {
        projectDescObj = typeof projectDesc === 'string' ? JSON.parse(projectDesc) : projectDesc;
    } catch (error) {
        return res.status(400).json({
        msg: "Invalid projectDesc format",
        });
    }

    // Add file URLs to projectDescObj
    projectDescObj.postImage = imageUrl;
    projectDescObj.postVideo = videoUrl;

    // Validate input using Zod schema
    const parseStatus = postSchema.safeParse({
        uid,
        projectTitle,
        projectRelated: projectRelated === 'true',
        projectDesc: projectDescObj,
    });

    if (!parseStatus.success) {
        res.status(400).json({
            msg: "Invalid inputs",
            errors: parseStatus.error.errors,
        });
    return;
  }

  try {
    const response = await prisma.post.create({
      data: {
        uid,
        projectTitle,
        projectRelated: projectRelated === 'true',
        projectDesc: {
          create: {
            ...projectDescObj,
          },
        },
      },
    });
    console.log(response);
    res.status(201).json({
        msg: "Post created successfully",
    });
    } 
  catch (error) {
        console.log("Error creating post:", error);
        res.status(500).json({
        msg: "Internal server error",
    });
  }
}