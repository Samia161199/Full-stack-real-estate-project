import React from "react";
import ChatBox from "../components/ChatBox"; // Import ChatBox component

const HelpCenter = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <ChatBox /> {/* Centered ChatBox */}
    </div>
  );
};

export default HelpCenter;
