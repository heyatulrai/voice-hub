import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import 'antd/dist/reset.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Navbar />
        <Content className="pt-[72px] bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App; 