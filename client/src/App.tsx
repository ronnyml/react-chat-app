import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "pages/Home";
import ChatPage from "pages/Chat";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:4000");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/chat" element={<ChatPage socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
