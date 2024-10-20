import axios from "axios";
import { getAuth, getIdToken } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ConversationPage() {
    const [error, setError] = useState<null | string>(null);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState<{ content: string; from: string }[]>([]);  // Store chat messages
    const location = useLocation();
    const [conversation , setConversation] = useState([]);
    const params = new URLSearchParams(location.search);
    const friendUid = params.get("fid");
    const socket = useRef<null | WebSocket>(null);

    useEffect(()=>{
        const fetchPreviousMessage = async()=>{
            const idToken = await getAuth().currentUser?.getIdToken();
            if(idToken){
                try{
                    let response = await axios.post("http://localhost:3000/api/v1/user/getUserConversation",{
                        friendUid,
                    },{
                        headers:{
                            Authorization:`Bearer ${idToken}`
                        }
                    })
                    setConversation(response.data);
                }
                catch(error:any){
                    console.log(error);
                    if(error.status === 404){
                        setError(null) // no messages in the chat yet
                    }
                    else{
                        setError("internal server error")
                    }
                }
            }
            else{
                setError("unauthorized");
            }
        }
        fetchPreviousMessage();
    },[friendUid])

    const handleSendMessage = () => {
        setError(null);

        if (friendUid && message.length > 0) {
            const messageData = JSON.stringify({
                type: "message",
                to: friendUid,
                content: message,
            });

            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.send(messageData);
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { from: "You", content: message },  // Add sent message to the chat
                ]);
                setMessage("");
            } else {
                setError("WebSocket connection is not open");
            }
        } else {
            setError("Unable to send message. Please enter valid content.");
        }
    };

    useEffect(() => {
        try {
            setError("");

            getAuth().currentUser?.getIdToken().then((idToken) => {
                socket.current = new WebSocket(`ws://localhost:8080?token=${idToken}`);

                socket.current.onopen = () => {
                    console.log("Connected to WebSocket server");
                };

                socket.current.onmessage = (event) => {
                    const receivedMessage = JSON.parse(event.data);
                    console.log("Received message:", receivedMessage);

                    // Add received message to the chatMessages state
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        { from: receivedMessage.from, content: receivedMessage.content },
                    ]);
                };

                socket.current.onclose = () => {
                    console.log("Connection closed");
                };
            });
        } catch (error) {
            console.log(error);
            setError("Unable to establish WebSocket connection.");
        }

        // Cleanup WebSocket connection on component unmount
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [friendUid]);

    return (
        <>
            <div>
                <h1>Conversation with {friendUid}</h1>
                {/* Render conversation */}
                {error ? <p style={{ color: "red" }}>{error}</p> : null}

                <div id="mainChat">
                    {chatMessages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.from}:</strong> {msg.content}
                        </div>
                    ))}
                </div>

                <input
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </>
    );
}