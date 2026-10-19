import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCompanyConversationAPI,
  sendCompanyMessageAPI,
} from "../../../api/company/companySupportAPI"; // adjust path

export const useCompanySupport = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    list: false,
    sending: false,
  });

  const fileInputRef = useRef(null);

  // ---------------- Fetch conversation ----------------
  useEffect(() => {
    const fetchConversation = async () => {
      setLoading((prev) => ({ ...prev, list: true }));
      try {
        const res = await getCompanyConversationAPI();
        const apiData = res?.data || res || {}; // handle if wrapped
        const messages = apiData.messages || [];

        const mappedMessages = messages.map((msg) => ({
          id: msg.id,

          text: msg.message,

          sender: msg.sender_type?.includes("Company") ? "company" : "admin",

          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          created_at: msg.created_at,
        }));

        const conversation = {
          id: apiData.conversation_id || apiData.id || 1,
          subject: apiData.other_participant?.name || "Support Team",
          supportPhone: apiData.support_phone || null,
          lastMessage:
            messages.length > 0 ? messages[messages.length - 1].message : "",
          time:
            messages.length > 0
              ? new Date(
                  messages[messages.length - 1].created_at,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          status: apiData.status || "active",
          unread: 0,
          messages: mappedMessages,
        };

        setConversations([conversation]);
        setSelectedChat(conversation);
      } catch (error) {
        console.error("Failed to fetch conversation", error);
        setConversations([]);
      } finally {
        setLoading((prev) => ({ ...prev, list: false }));
      }
    };

    fetchConversation();
  }, []);

  // ---------------- Select chat (only one, but keep interface) ----------------
  const selectChat = useCallback((chat) => {
    setSelectedChat(chat);
  }, []);

  // ---------------- File handling ----------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const clearAttachedFile = useCallback(() => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ---------------- Send message ----------------
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() && !attachedFile) return;
    if (!selectedChat) return;

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text: chatInput.trim(),
      sender: "company",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachment: attachedFile ? { ...attachedFile } : null,
      pending: true,
    };

    const updatedMessages = [...(selectedChat.messages || []), newMessage];
    const updatedChat = {
      ...selectedChat,
      messages: updatedMessages,
      lastMessage: newMessage.text || "📎 File",
      time: "Just now",
    };

    setSelectedChat(updatedChat);
    setConversations([updatedChat]);
    setChatInput("");
    clearAttachedFile();

    try {
      const payload = {
        receiver_id: 1, // 🔁 replace with actual admin ID
        receiver_type: "admin",
        message: newMessage.text,
      };

      const res = await sendCompanyMessageAPI(payload);
      const msg = res?.data || res;

      // Replace pending message with real one
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === tempId
            ? {
                id: msg.id,
                text: msg.message,
                sender: "company",
                time: new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : m,
        ),
      }));
    } catch (error) {
      console.error("Send message failed", error);
    }
  }, [chatInput, attachedFile, selectedChat, clearAttachedFile]);

  // ---------------- New conversation (if allowed) ----------------
  const handleNewConversation = useCallback(() => {
    const newConv = {
      id: `temp-${Date.now()}`,
      subject: "New Request",
      lastMessage: "",
      time: "now",
      status: "active",
      messages: [],
    };
    setConversations([newConv]);
    setSelectedChat(newConv);
  }, []);

  // ---------------- Filter (unused, but kept for consistency) ----------------
  const filteredConversations = conversations.filter((conv) =>
    conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    conversations,
    filteredConversations,
    selectedChat,
    selectChat,
    chatInput,
    setChatInput,
    attachedFile,
    fileInputRef,
    handleFileChange,
    clearAttachedFile,
    handleSendMessage,
    handleNewConversation,
    searchTerm,
    setSearchTerm,
    loading,
  };
};
