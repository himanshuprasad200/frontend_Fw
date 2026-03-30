import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import "./Chat.css";
import { FaPaperPlane, FaArrowLeft, FaComments, FaLock, FaCheckDouble } from "react-icons/fa";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";

const Chat = () => {
  const { id: targetUserId } = useParams(); // The user to chat with
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const scrollRef = useRef();
  const socketRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const socketUrl = window.location.hostname === "localhost"
      ? "http://localhost:4050"
      : axios.defaults.baseURL || window.location.origin;

    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    // Notify server of current user
    socketRef.current.emit("add_user", user._id);

    // Join specialized project room
    const room = [user._id, targetUserId].sort().join("_");
    socketRef.current.emit("join_chat", room);

    // Listen for incoming messages
    socketRef.current.on("received_message", (arrivalMessage) => {
      setMessages((prev) => [...prev, arrivalMessage]);
    });

    // Listen for online users
    socketRef.current.on("get_users", (onlineUsers) => {
      const online = onlineUsers.some((u) => u.userId === targetUserId);
      setIsOnline(online);
    });

    // Fetch history and user info
    const fetchData = async () => {
      try {
        const [messagesRes, userRes] = await Promise.all([
          axios.get(`/api/v1/messages?userId=${targetUserId}`),
          axios.get(`/api/v1/user/chat/${targetUserId}`)
        ]);
        
        setMessages(messagesRes.data.messages);
        setTargetUser(userRes.data.user);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load chat");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      socketRef.current.disconnect();
    };
  }, [isAuthenticated, navigate, targetUserId, user._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const room = [user._id, targetUserId].sort().join("_");

    const messageData = {
      sender: user._id,
      senderName: user.name, // Added for notifications
      receiver: targetUserId,
      text: newMessage,
      room,
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }
  };

  if (loading) return <div className="chatLoader"><Loader /></div>;

  return (
    <div className="chatPageHolder">
      <div className="chatContainer">
        {/* Header - Profile Style */}
        <div className="chatHeader">
          <button className="backBtn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          
          <div className="targetUserProfile">
            <img 
              src={targetUser?.avatar?.url || "/default-avatar.png"} 
              alt={targetUser?.name} 
              className="targetUserAvatar"
            />
            <div className="targetUserInfo">
              <h3>{targetUser?.name || "User"}</h3>
              <p className={`onlineStatus ${isOnline ? "online" : "offline"}`}>
                {isOnline ? "online" : "offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Message Area with Pattern Background */}
        <div className="chatBox whatsappBg">
          <div className="messagesWrapper">
            {messages.length === 0 && (
              <div className="encryptedNote">
                <FaLock style={{ fontSize: "10px", marginRight: "5px" }} /> Messages are encrypted with standard security protocol.
              </div>
            )}
            
            {messages.map((m, index) => (
              <div
                key={index}
                className={m.sender === user._id ? "message ownMessage" : "message receivedMessage"}
              >
                <div className="messageText">{m.text}</div>
                <div className="messageMeta">
                  <span className="messageTime">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.sender === user._id && <FaCheckDouble className="readCheck" />}
                </div>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>
        </div>

        {/* Improved Input Area */}
        <div className="chatInputWrapper">
          <form className="chatForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <textarea
                ref={textareaRef}
                placeholder="Type a message"
                value={newMessage}
                rows="1"
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button type="submit" className="sendBtn" disabled={!newMessage.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
