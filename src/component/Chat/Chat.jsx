import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import "./Chat.css";
import { FaPaperPlane, FaArrowLeft, FaComments, FaLock, FaCheckDouble, FaImage, FaFileAlt, FaVideo, FaPaperclip, FaTimes } from "react-icons/fa";
import Loader from "../layout/Loader/Loader";
import toast from "../../utils/CustomToast";
import Avatar from "../layout/Avatar/Avatar";

const Chat = () => {
  const { id: targetUserId } = useParams(); // The user to chat with
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef();
  const socketRef = useRef();
  const textareaRef = useRef();
  const fileInputRef = useRef();

  const getMessageDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const socketUrl = window.location.hostname === "localhost"
      ? "https://backend-i86g.onrender.com"
      : axios.defaults.baseURL || window.location.origin;

    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    socketRef.current.emit("add_user", String(user._id));

    // Join specialized project room
    const room = [String(user._id), String(targetUserId)].sort().join("_");
    socketRef.current.emit("join_chat", room);

    // Listen for incoming messages
    socketRef.current.on("received_message", (arrivalMessage) => {
      console.log("Socket received_message event:", arrivalMessage);
      setMessages((prev) => [...prev, arrivalMessage]);
    });

    // Listen for online users
    socketRef.current.on("get_users", (onlineUsers) => {
      const online = onlineUsers.some((u) => String(u.userId) === String(targetUserId));
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 10) {
      toast.error("You can select max 10 files");
      return;
    }

    // Basic size check (e.g., 20MB per file)
    const tooLarge = files.some(file => file.size > 20 * 1024 * 1024);
    if (tooLarge) {
      toast.error("One or more files are too large (max 20MB each)");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append("media", file);
    });

    try {
      console.log(`Starting upload of ${files.length} files...`);
      const { data } = await axios.post("/api/v1/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        console.log("Media upload success:", data.media);
        setSelectedMedia(data.media); // This is now an array
      }
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error(error.response?.data?.message || "FileUpload failed");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again
      if (e.target) e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedMedia) {
      console.log("Send blocked: empty message and no media");
      return;
    }

    const room = [String(user._id), String(targetUserId)].sort().join("_");

    const messageData = {
      sender: String(user._id),
      senderName: user.name,
      receiver: String(targetUserId),
      text: newMessage,
      media: selectedMedia || null,
      room,
    };

    console.log("Emitting send_message:", messageData);
    socketRef.current.emit("send_message", messageData);

    setNewMessage("");
    setSelectedMedia(null);
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
            <Avatar
              src={targetUser?.avatar?.url}
              name={targetUser?.name}
              size="md"
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

            {messages.map((m, index) => {
              const currentDate = m.createdAt ? new Date(m.createdAt).toDateString() : "";
              const previousDate = index > 0 && messages[index - 1].createdAt
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;
              const showDivider = currentDate && currentDate !== previousDate;

              return (
                <React.Fragment key={index}>
                  {showDivider && (
                    <div className="chatDateDivider">
                      <span>{getMessageDateLabel(m.createdAt)}</span>
                    </div>
                  )}
                  <div
                    className={String(m.sender) === String(user._id) ? "message ownMessage" : "message receivedMessage"}
                  >
                    {m.media && m.media.length > 0 && (
                      <div className={`messageMediaContainer ${m.media.length > 1 ? "multiMedia" : ""}`}>
                        {m.media.map((item, i) => (
                          <div key={i} className="messageMedia">
                            {item.type === "image" ? (
                              <img src={item.url} alt="Shared" className="sharedImage" onClick={() => window.open(item.url, '_blank')} />
                            ) : item.type === "video" ? (
                              <video src={item.url} controls className="sharedVideo" />
                            ) : (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="documentLink">
                                <FaFileAlt /> <span>Document</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.text && <div className="messageText">{m.text}</div>}
                    <div className="messageMeta">
                      <span className="messageTime">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.sender === user._id && <FaCheckDouble className="readCheck" />}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={scrollRef}></div>
          </div>
        </div>

        {/* Improved Input Area */}
        <div className="chatInputWrapper">
          {selectedMedia && selectedMedia.length > 0 && (
            <div className="selectedMediaPreview">
              <div className="previewInfo">
                <FaPaperclip />
                <span>{selectedMedia.length} files attached</span>
              </div>
              <button className="removeMediaBtn" onClick={() => setSelectedMedia(null)}>
                <FaTimes />
              </button>
            </div>
          )}
          <form className="chatForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
                multiple
              />
              <button
                type="button"
                className="attachBtn"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? <div className="uploadSpinner"></div> : <FaPaperclip />}
              </button>
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
            <button type="submit" className="sendBtn" disabled={(!newMessage.trim() && !selectedMedia) || uploading}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
