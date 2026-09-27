import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Chat } from '@/pages/Chat';
import { Home } from '@/pages/Home';

import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
