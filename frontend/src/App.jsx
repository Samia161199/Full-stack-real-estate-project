import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";

const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <ChatProvider>
          <Routes>
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </ChatProvider>
      </NotificationProvider>
    </Router>
  );
};



export default App;
