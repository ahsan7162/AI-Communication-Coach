import React, { useState, useEffect, useRef } from "react";
import {
  fetchChats,
  fetchMessagesByChatId,
  sendMessage as sendMessageApi,
  Chat,
  Message,
  createChat,
  createMessage,
  startChat,
} from "../../services/chatApi";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const ChatPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      let fetchedChats: Chat[] = await fetchChats();
      if (fetchedChats.length === 0) return;
      fetchedChats = fetchedChats
        .map((chat) => ({
          ...chat,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${chat.id}`,
        }))
        .sort((a, b) => b.id - a.id); // Sorting in descending order by id
      setChats(fetchedChats);
    } catch (error) {
      debugger;
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.chat_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.chat_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatSelect = async (chat: Chat) => {
    setActiveChat(chat);
    try {
        await startChat(chat.id);
      const messages = await fetchMessagesByChatId(chat.id);
      setMessages(messages);
    } catch (error) {
      setMessages([]);
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "" || !activeChat || sending) return;

    setSending(true);
    try {
      let newMessages = [...messages];
      newMessages.push({
        id: Math.random(),
        chat_id: activeChat.id,
        content: input,
        message_type: "human",
      });
      setMessages(newMessages);
      const newMessage = await sendMessageApi(activeChat.id, input);
      newMessages.push(newMessage);
      setMessages(newMessages);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateChat = async () => {
    const newChat = await createChat("New Chat");
    newChat.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${newChat.id}`;
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    await startChat(newChat.id);
    const message = await createMessage(newChat.id, "Hello, how can I help you with english communication?");
    setMessages([message]);
  };

  if (!localStorage.getItem("token")) {
    navigate("/");
  }
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar for Chat List */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2 style={{ padding: 0, margin: 0 }}>AI Communication Coach</h2>
          <button
            className="new-chat-btn"
            onClick={() => {
              handleCreateChat();
            }}
          >
            <span className="plus-icon">+</span>
            New Chat
          </button>

          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                activeChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <img
                src={chat.avatar}
                alt={chat.chat_name}
                className="chat-avatar"
              />
              <div className="chat-info">
                <span className="chat-name">{chat.chat_name}</span>
                <span className="chat-last-message">{chat.chat_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      {activeChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <img
              src={activeChat.avatar}
              alt={activeChat.chat_name}
              className="chat-avatar"
            />
            <h2>{activeChat.chat_name}</h2>
          </div>

          <div className="chat-messages">
            {messages.map((msg: Message, index) => (
              <div key={index} className={`chat-bubble ${msg.message_type}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderRadius: "10px" }}
              disabled={sending}
            />
            <button
              type="submit"
              style={{ marginLeft: "10px" }}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      ) : (
        <div className="chat-window">
          <div className="no-chat-selected">
            Select a chat to start messaging
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
