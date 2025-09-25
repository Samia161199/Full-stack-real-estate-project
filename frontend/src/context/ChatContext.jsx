import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message, sender, recipient) => {
    try {
      // Send message to backend with the recipient email
      await axios.post(
        "http://localhost:3000/chat/send",
        { message, sender, recipient },
        { withCredentials: true }
      );
      
      // Optionally, update the message list immediately for the user interface
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
