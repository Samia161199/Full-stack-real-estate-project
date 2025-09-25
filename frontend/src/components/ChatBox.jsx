import React, { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "../context/ChatContext"; // Ensure ChatContext is correctly set

const ChatBox = () => {
  const { messages, sendMessage } = useChat();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Include recipient email (helpcenter@gmail.com)
      sendMessage(message, "User", "helpcenter@gmail.com"); 
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Help Center</h2>

      {/* Messages */}
      <div className="flex flex-col space-y-4 mb-6 max-h-72 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              msg.sender === "User" ? "self-end bg-blue-500 text-white" : "self-start bg-gray-100 text-gray-800"
            } max-w-xs shadow-sm transition-all duration-300`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center">
        <input
          type="text"
          className="border border-gray-300 rounded-lg py-2 px-4 w-full mr-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
