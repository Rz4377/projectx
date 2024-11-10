import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  id: number;
  content: string;
  sentAt: string;
  senderUid: string;
  senderName: string;
  receiverUid: string;
  receiverName: string;
}
const API_URL = import.meta.env.VITE_API_URL;

export default function ConversationPage() {
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const friendUid = params.get("fid");
  const socket = useRef<null | WebSocket>(null);
  const [uid, setUid] = useState<string>("");
  const [friendName, setFriendName] = useState<string>("");
  const [myName, setMyName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        setMyName(user.displayName || "You");
      } else {
        setError("User not authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFriendName = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user/getUser`, {
          params: { uid: friendUid },
        });
        setFriendName(response.data.name);
      } catch (error) {
        console.error("Error fetching friend's name:", error);
        setFriendName(friendUid || "Unknown");
      }
    };

    if (friendUid) {
      fetchFriendName();
    }
  }, [friendUid]);

  useEffect(() => {
    const fetchPreviousMessages = async () => {
      const user = getAuth().currentUser;
      if (!user) {
        setError("Unauthorized");
        return;
      }
      const idToken = await user.getIdToken();
      const userUid = user.uid;

      if (idToken) {
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/user/getUserConversation`,
            {
              uid: userUid,
              friendUid,
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          const messages: ChatMessage[] = response.data.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sentAt: msg.sentAt,
            senderUid: msg.sender.uid,
            senderName: msg.sender.name,
            receiverUid: msg.receiver.uid,
            receiverName: msg.receiver.name,
          }));

          // Sort messages in ascending order (oldest first)
          messages.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );

          setChatMessages(messages);
        } catch (error: any) {
          console.log(error);
          if (error.response && error.response.status === 404) {
            setError(null); // No messages in the chat yet
          } else {
            setError("Internal server error");
          }
        }
      } else {
        setError("Unauthorized");
      }
    };
    if (friendUid && uid) {
      fetchPreviousMessages();
    }
  }, [friendUid, uid]);

  const handleSendMessage = () => {
    if (!uid) {
      setError("User UID not available.");
      return;
    }

    if (friendUid && message.length > 0) {
      const messageData = JSON.stringify({
        type: "message",
        to: friendUid,
        from: uid, // Include sender UID
        content: message,
      });

      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(messageData);

        const newMessage: ChatMessage = {
          id: Date.now(),
          content: message,
          sentAt: new Date().toISOString(),
          senderUid: uid,
          senderName: myName,
          receiverUid: friendUid!,
          receiverName: friendName,
        };

        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
      } else {
        setError("WebSocket connection is not open.");
      }
    } else {
      setError("Unable to send message. Please enter valid content.");
    }
  };

  useEffect(() => {
    if (!uid) return; // Ensure uid is available before connecting

    const handleWebsocketConnection = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) {
          setError("User not authenticated.");
          return;
        }

        const idToken = await user.getIdToken();
        if (!idToken) {
          setError("Unauthorized");
          return;
        }

        socket.current = new WebSocket(`wss://api.tallentgallery.online:444?token=${idToken}`);

        socket.current.onopen = () => {
          console.log("Connected to WebSocket server");
        };

        socket.current.onmessage = (event) => {
          const receivedMessage = JSON.parse(event.data);


          const senderUid = receivedMessage.from;
          const senderName = senderUid === friendUid ? friendName : myName;

          const newMessage: ChatMessage = {
            id: receivedMessage.id || Date.now(),
            content: receivedMessage.content,
            sentAt: receivedMessage.sentAt || new Date().toISOString(),
            senderUid,
            senderName,
            receiverUid: uid,
            receiverName: myName,
          };

          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.current.onclose = () => {
          console.log("Connection closed");
        };
      } catch (error) {
        console.error("WebSocket Error:", error);
        setError("Unable to establish WebSocket connection.");
      }
    };

    handleWebsocketConnection();

    return () => {
      if (socket.current) socket.current.close();
    };
  }, [uid, friendUid, friendName, myName]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {error && (
        <div className="text-red-500 text-center p-2">
          {error}
        </div>
      )}
      {/* Chat Messages */}
      <div
        id="mainChat"
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ marginBottom: '4rem' }} // Reserve space for input area
      >
        {chatMessages.map((msg) => {
          const isSentByCurrentUser = msg.senderUid === uid;
          return (
            <div
              key={msg.id}
              className={`flex ${
                isSentByCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-2 rounded-lg ${
                  isSentByCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {!isSentByCurrentUser && (
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {msg.senderName}
                  </div>
                )}
                <div>{msg.content}</div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 flex items-center fixed bottom-0 left-0 right-0">
        <input
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          placeholder="Enter your message"
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}