import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  User,
  MessageCircle,
  Paperclip,
  Headset,
  ArrowLeft,
  Phone,
} from "lucide-react";
import Cookies from "js-cookie";
import { useWorkerSupport } from "../../workerhooks/useWorkerSupport";

const WorkerSupport = () => {
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
    loading,
  } = useWorkerSupport();

  const messagesEndRef = useRef(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  useEffect(() => {
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setSupportPhone(Cookies.get("phone_number") || "");
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedChat?.messages, selectedChat?.id]);
  const formatMessageDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

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

      <div className="w-full min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-lg overflow-hidden flex">
          {/* Sidebar – hidden on mobile when chat selected */}
          <div
            className={`lg:w-80 w-full border-r border-slate-200 bg-white flex flex-col ${
              selectedChat ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Headset size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Worker Support</h1>
                  <p className="text-sm text-blue-100">Support conversations</p>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto support-scrollbar">
              {loading.list ? (
                <div className="p-6 text-center text-slate-400">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${
                      selectedChat?.id === chat.id
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <User size={18} />
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-slate-800 truncate flex-1 min-w-0">
                            {chat.subject}
                          </h3>
                          <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                            {chat.time}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 truncate mt-1">
                          {chat.lastMessage || "No messages yet"}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              chat.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {chat.status}
                          </span>

                          {chat.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area – hidden on mobile when no chat selected */}
          <div
            className={`flex-1 flex flex-col bg-slate-50 ${
              !selectedChat ? "hidden lg:flex" : "flex"
            }`}
          >
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    <button
                      onClick={deselectChat}
                      className="lg:hidden p-1 -ml-2 rounded-full hover:bg-slate-100 transition"
                      aria-label="Back to conversation list"
                    >
                      <ArrowLeft size={20} className="text-slate-600" />
                    </button>

                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Headset size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-800 text-lg">
                        {selectedChat.subject}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">
                          Support Team
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            selectedChat.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {selectedChat.status}
                        </span>
                      </div>
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

                    {supportPhone && (
                      <a
                        href={`tel:${supportPhone}`}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                      >
                        <Phone size={14} />
                        Call
                      </a>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 support-scrollbar">
                  {selectedChat.messages?.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <MessageCircle size={60} className="opacity-30 mb-4" />
                      <p className="text-lg">No messages yet</p>
                      <p className="text-sm">Start the conversation</p>
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
                              msg.sender === "worker"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                                msg.sender === "worker"
                                  ? "bg-blue-600 text-white rounded-br-md"
                                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                              }`}
                            >
                              {msg.pending && (
                                <span className="text-xs opacity-70 block mb-1">
                                  Sending...
                                </span>
                              )}

                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>

                              {msg.attachment && (
                                <div
                                  className={`flex items-center gap-2 mt-3 text-xs rounded-lg px-3 py-2 ${
                                    msg.sender === "worker"
                                      ? "bg-white/20"
                                      : "bg-slate-100"
                                  }`}
                                >
                                  <Paperclip size={13} />

                                  <span className="truncate max-w-[150px]">
                                    {msg.attachment.name}
                                  </span>

                                  <span className="opacity-70">
                                    ({(msg.attachment.size / 1024).toFixed(1)}{" "}
                                    KB)
                                  </span>
                                </div>
                              )}

                              <div className="text-right mt-2">
                                <span className="text-xs opacity-70">
                                  {msg.time}
                                </span>
                              </div>
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
                  {attachedFile && (
                    <div className="flex items-center gap-2 mb-3 bg-slate-100 rounded-xl px-3 py-2 w-fit">
                      <Paperclip size={14} className="text-slate-500" />
                      <span className="text-sm text-slate-700 truncate max-w-[220px]">
                        {attachedFile.name}
                      </span>
                      <button
                        onClick={clearAttachedFile}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={
                        (!chatInput.trim() && !attachedFile) || loading.sending
                      }
                      className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center text-slate-400">
                  <Headset size={60} className="mx-auto mb-4 opacity-40" />
                  <h2 className="text-xl font-medium mb-2">Worker Support</h2>
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerSupport;
