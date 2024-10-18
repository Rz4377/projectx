import { z } from "zod"

export const signupSchema = z.object({
    name: z.string(),
    uid: z.string(),
    email: z.string().email(),
    userId: z.string(),
    profilePic: z.string().nullable().optional(),
});

export const postSchema = z.object({
    projectTitle: z.string(),
    projectDesc: z.object({
        postImage: z.string().optional().nullable(),
        postVideo: z.string().optional().nullable(),
        description: z.string(),
        githubLink: z.string().optional().nullable(),
        liveLink: z.string().optional().nullable()
    }),
    uid: z.string(),
    projectRelated: z.boolean()
})

export const updateSchema  = z.object({
    projectId: z.string(),
    uid: z.string(),
    projectTitle: z.string().optional(),
    projectDesc: z.object({
        postImage: z.string().optional().nullable(),
        postVideo: z.string().optional().nullable(),
        description: z.string().optional(),
        githubLink: z.string().optional().nullable(),
        liveLink: z.string().optional().nullable()
    }).optional(),
    projectRelated: z.boolean().optional()
})

export const deleteSchema  = z.object({
    projectId: z.string(),
    uid:z.string()
})

export const updateReactionSchema = z.object({
    projectId: z.string(),
    uid:z.string(),
    upvote: z.boolean().optional(),
    downvote: z.boolean().optional()
})

export const addComments = z.object({
    uid: z.string(),
    content: z.string(),
    projectId: z.string()
  });