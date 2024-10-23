import prisma from "@repo/db";

export async function deleteFriendFromList(userUid: string, friendUid: string) {
  try {
    await prisma.friendList.deleteMany({
      where: {
        OR: [
          { userUid, friendUid },
          { userUid: friendUid, friendUid: userUid }, 
        ]
      }
    });
    
    console.log(`Friendship between ${userUid} and ${friendUid} deleted.`);
    return true;
  } catch (error) {
    console.error("Error deleting friend from FriendList: ", error);
    return false;
  }
}