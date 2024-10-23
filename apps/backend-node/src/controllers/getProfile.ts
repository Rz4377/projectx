import prisma from "@repo/db";
import { Request, Response } from "express";

export default async function getProfile(req: Request, res: Response) {
  const profileUserId = req.params.userId; // The userId of the profile being viewed
  const requestingUserUid = req.body?.uid; // The UID of the currently authenticated user

  if (!profileUserId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch the profile user's information
    const userProfile = await prisma.user.findUnique({
      where: {
        userId: profileUserId,
      },
      select: {
        name: true,
        uid: true,
        profilePic: true,
        userId: true,
        posts: {
          select: {
            projectId: true,
            projectTitle: true,
            projectRelated: true,
            projectDesc: {
              select: {
                description: true,
                liveLink: true,
                githubLink: true,
                postImage: true,
                postVideo: true,
              },
            },
          },
        },
        friends: {
          where: {
            ReqAccepted: true,
          },
          select: {
            friendUid: true,
          },
        },
        friendsOf: {
          where: {
            ReqAccepted: true,
          },
          select: {
            userUid: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate followers and following counts
    const followersCount = userProfile.friendsOf.length;
    const followingCount = userProfile.friends.length;

    // Check if the requesting user is following the profile user
    let isFollowing = false;

    if (requestingUserUid) {
      const friendship = await prisma.friendList.findFirst({
        where: {
          userUid: requestingUserUid,
          friendUid: userProfile.uid,
          ReqAccepted: true,
        },
      });

      isFollowing = !!friendship;
    }

    // Prepare the response data
    const responseData = {
      user: {
        name: userProfile.name,
        uid: userProfile.uid,
        profilePic: userProfile.profilePic,
        userId: userProfile.userId,
      },
      posts: userProfile.posts,
      followersCount,
      followingCount,
      isFollowing,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}