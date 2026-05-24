import React, { Fragment, useEffect, useState } from "react";
import "./AdminChats.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes, FaComments, FaClock, FaUser, FaLock } from "react-icons/fa";
import Loader from "../layout/Loader/Loader";
import toast from "../../utils/CustomToast";

const AdminChats = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("/api/v1/conversations");
        if (data.success) {
          setConversations(data.conversations);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load conversations");
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Filter conversations by user name or email
  const filteredConversations = conversations.filter((conv) => {
    const search = searchTerm.toLowerCase();
    const userName = conv.user?.name?.toLowerCase() || "";
    const userEmail = conv.user?.email?.toLowerCase() || "";
    return userName.includes(search) || userEmail.includes(search);
  });

  const getMessageSnippet = (msg) => {
    if (!msg) return "";
    if (msg.text) {
      return msg.text.length > 60 ? msg.text.slice(0, 60) + "..." : msg.text;
    }
    if (msg.media && msg.media.length > 0) {
      const type = msg.media[0].type || "file";
      return `[Sent a ${type}]`;
    }
    return "New message";
  };

  const formatChatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();

    // Check if today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Return standard date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <Fragment>
      <MetaData title="Admin Chats - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="adminChatsContainer">
            {/* Header section with heading and search */}
            <div className="adminChatsHeaderContainer">
              <div>
                <h1 className="adminChatsHeading">Admin Inbox</h1>
                <p className="chatsCount">
                  Total Active Conversations: {conversations.length}
                </p>
              </div>

              {/* Search input */}
              <div className="adminSearchBox">
                <FaSearch className="searchIcon" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FaTimes
                    className="clearSearch"
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>
            </div>

            {loading ? (
              <div className="chatListLoader">
                <Loader />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="emptyChatsState">
                <div className="emptyIconBox">
                  <FaComments className="emptyIcon" />
                </div>
                <h3>No Conversations Found</h3>
                <p>
                  {searchTerm
                    ? `No conversations match "${searchTerm}"`
                    : "You haven't initiated or received any chats yet."}
                </p>
                {searchTerm ? (
                  <button className="resetSearchBtn" onClick={() => setSearchTerm("")}>
                    Clear Filter
                  </button>
                ) : (
                  <Link to="/admin/users" className="startChatBtn">
                    View Users to Start Chat
                  </Link>
                )}
              </div>
            ) : (
              <div className="chatsListGrid">
                {filteredConversations.map((conv) => (
                  <Link
                    key={conv.user._id}
                    to={`/chat/${conv.user._id}`}
                    className="chatUserCard"
                  >
                    <div className="chatCardAvatarContainer">
                      <img
                        src={conv.user.avatar?.url || "/default-avatar.png"}
                        alt={conv.user.name}
                        className="chatUserAvatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <span className={`statusDot ${conv.user.role || "user"}`} />
                    </div>

                    <div className="chatCardContent">
                      <div className="chatCardTopRow">
                        <h3 className="chatCardName">{conv.user.name}</h3>
                        <span className="chatCardTime">
                          <FaClock className="clockIcon" />{" "}
                          {formatChatTime(conv.latestMessage?.createdAt)}
                        </span>
                      </div>

                      <div className="chatCardEmail">{conv.user.email}</div>

                      <div className="chatCardBottomRow">
                        <p className="chatCardSnippet">
                          {getMessageSnippet(conv.latestMessage)}
                        </p>
                        <span className={`chatRoleBadge ${conv.user.role || "user"}`}>
                          {conv.user.role || "user"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="secureChatBadge">
              <FaLock />
              <span>All conversations are securely encrypted and monitored under terms of service.</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminChats;
