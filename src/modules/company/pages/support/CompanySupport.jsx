import React, { useEffect, useRef } from "react";
import {
  Send,
  Building2,
  MessageCircle,
  Paperclip,
  Headset,
  Phone,
  ArrowLeft,
  FaWhatsapp,
} from "lucide-react";
import Cookies from "js-cookie";

import { useCompanySupport } from "../../companyhooks/useCompanySupport";

const CompanySupport = () => {
  const {
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
    searchTerm,
    setSearchTerm,
    loading,
  } = useCompanySupport();

  const messagesEndRef = useRef(null);
  const [whatsappNumber, setWhatsappNumber] = React.useState("");
  useEffect(() => {
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedChat?.messages, selectedChat?.id]);
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to go back to conversation list on mobile
  const deselectChat = () => selectChat(null);

  return (
    <>
      {/* Thin custom scrollbar styles */}
      <style>{`
        .support-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .support-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .support-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .support-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        /* Firefox */
        .support-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>

      <div className="flex h-screen rounded-xl bg-slate-100 overflow-hidden">
        {/* Left Sidebar - hidden on mobile when chat selected */}
        <div
          className={`lg:w-80 w-full bg-white border-r border-slate-200 flex flex-col shrink-0 ${
            selectedChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <Headset size={22} />
              <h1 className="text-lg font-semibold">Company Support</h1>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto support-scrollbar">
            {loading.list ? (
              <div className="p-4 text-center text-slate-400">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`p-3 border-b border-slate-100 cursor-pointer transition hover:bg-slate-50 ${
                    selectedChat?.id === chat.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 size={18} />
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm truncate text-slate-800 flex-1 min-w-0">
                          {chat.subject}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap ml-2">
                          {chat.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {chat.lastMessage || "No messages yet"}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            chat.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {chat.status}
                        </span>
                      </div>
                    </div>

                    {/* Unread Badge */}
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col ${
            !selectedChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  <button
                    onClick={deselectChat}
                    className="lg:hidden p-1 -ml-2 rounded-full hover:bg-slate-100 transition"
                    aria-label="Back to conversation list"
                  >
                    <ArrowLeft size={20} className="text-slate-600" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Headset size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {selectedChat.subject}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Support Team</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          selectedChat.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedChat.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        className="w-4 h-4"
                      />
                      WhatsApp
                    </a>
                  )}

                  {selectedChat.supportPhone && (
                    <a
                      href={`tel:${selectedChat.supportPhone}`}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 support-scrollbar">
                {selectedChat.messages?.length === 0 ? (
                  <div className="text-center text-slate-400 mt-20">
                    <MessageCircle
                      size={48}
                      className="mx-auto opacity-30 mb-3"
                    />
                    <p>No messages yet. Start the conversation.</p>
                  </div>
                ) : (
                  selectedChat.messages?.map((msg, index) => {
                    const currentDate = formatMessageDate(msg.created_at);

                    const previousDate =
                      index > 0
                        ? formatMessageDate(
                            selectedChat.messages[index - 1].created_at,
                          )
                        : null;

                    const showDate = currentDate !== previousDate;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="bg-slate-200 text-slate-600 text-xs px-4 py-1 rounded-full shadow-sm">
                              {currentDate}
                            </span>
                          </div>
                        )}

                        <div
                          className={`flex ${
                            msg.sender === "company"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                              msg.sender === "company"
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-white text-slate-800 rounded-bl-md border border-slate-200"
                            }`}
                          >
                            {msg.pending && (
                              <span className="text-xs opacity-70">
                                (sending…)
                              </span>
                            )}

                            <p className="text-sm whitespace-pre-wrap">
                              {msg.text}
                            </p>

                            {msg.attachment && (
                              <div
                                className={`flex items-center gap-2 mt-2 text-xs rounded-lg p-2 ${
                                  msg.sender === "company"
                                    ? "bg-white/20"
                                    : "bg-slate-100"
                                }`}
                              >
                                <Paperclip size={12} />

                                <span className="truncate max-w-[120px]">
                                  {msg.attachment.name}
                                </span>

                                <span className="opacity-70">
                                  (
                                  {((msg.attachment.size || 0) / 1024).toFixed(
                                    1,
                                  )}{" "}
                                  KB)
                                </span>
                              </div>
                            )}

                            <span className="text-xs opacity-70 block text-right mt-1">
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-slate-200 p-4">
                {/* Attached File Preview */}
                {attachedFile && (
                  <div className="flex items-center gap-2 mb-3 ml-12 px-3 py-2 bg-slate-100 rounded-full text-sm w-fit">
                    <Paperclip size={14} className="text-slate-500" />
                    <span className="truncate max-w-[200px]">
                      {attachedFile.name}
                    </span>
                    <button
                      onClick={clearAttachedFile}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-3">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {/* Message Input */}
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows="1"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      (!chatInput.trim() && !attachedFile) || loading.sending
                    }
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
              <div className="text-center">
                <Headset size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a conversation or start a new request</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanySupport;
