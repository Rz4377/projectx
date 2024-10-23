
import WebSocket, { WebSocketServer } from 'ws';
import prisma from "@repo/db"
import { adminAuth } from './config/firebaseAdmin';

const wss = new WebSocketServer({ port: 8080 });
const activeConnections = new Map<string, WebSocket>();

wss.on('connection', async (ws: WebSocket, req) => {
    console.log("Client connected");

    // Extract the idToken from the query parameters
    const reqUrl = new URL(`http://localhost:8080${req.url}`);
    const idToken = reqUrl.searchParams.get('token');
    console.log(idToken);
    
    if (!idToken) {
        ws.close(4000, "No token provided");
        return;
    }

    try {
        // Verify Firebase token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid
        // Add user to active connections
        activeConnections.set(uid, ws); 

        // Handle incoming messages
        ws.on('message', async(message: string) => {
            try {
                console.log('Received: %s', message);
                const { to, content } = JSON.parse(message);
                console.log(to , content);
                const recipientSocket = activeConnections.get(to);

                const [participantA, participantB] = [uid, to].sort(); // Ensure consistent order

                let conversation = await prisma.conversation.findFirst({
                where: {
                    participantA,
                    participantB,
                },
                });

                if (!conversation) {
                conversation = await prisma.conversation.create({
                    data: {
                    participantA,
                    participantB,
                    participants: {
                        connect: [{ uid: participantA }, { uid: participantB }],
                    },
                    },
                });
                }

                const savedMessage = await prisma.message.create({
                    data: {
                      content,
                      senderUid: uid, // Set the sender's UID directly
                      receiverUid: to, // Set the receiver's UID directly
                      sentAt: new Date(),
                      conversationId: conversation.id, // Use the conversation ID directly
                    },
                  });
                if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
                    recipientSocket.send(JSON.stringify({ from: uid, content }));
                } else {
                    console.log(`User ${to} is not connected or WebSocket is not open`);
                }
            } catch (error) {
                console.error("Error processing message:", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });

        // Handle WebSocket close event
        ws.on("close", () => {
            console.log(`Client ${uid} disconnected`);
            activeConnections.delete(uid);  // Remove user from active connections
        });

        // Handle WebSocket error event
        ws.on('error', (error) => {
            console.error("WebSocket error:", error);
            ws.close(4001, "WebSocket error");
        });

    } catch (error) {
        console.error("Token verification failed:", error);
        ws.close(4000, "Token verification failed");
    }
});

console.log("WebSocket server running on port 8080");