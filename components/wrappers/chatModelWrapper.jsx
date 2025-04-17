"use client";

import { useEffect, useState } from "react";
import ChatModal from "components/chatModal";
import socket from "lib/socket-client";
export default function ChatModalWrapper({ isOpen, onClose, bookingId, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join room for this booking (for private chat)
    if (bookingId) {
      socket.emit("joinRoom", bookingId);
    }

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [bookingId]);

  const handleSend = (text) => {
    const message = {
      text,
      sender: currentUser, // "user" or "helper"
      timestamp: new Date().toISOString(),
      room: bookingId,
    };

    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]); // optimistic update
  };

  return (
    <ChatModal
      isOpen={isOpen}
      onClose={onClose}
      messages={messages}
      onSend={handleSend}
    />
  );
}
