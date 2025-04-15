import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Header } = Layout;

const Navbar: React.FC = () => {
  return (
    <Header className="bg-white px-4 shadow-sm fixed w-full z-10" style={{ height: 'auto', lineHeight: '1.5', padding: '12px 24px' }}>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-blue-600 m-0">VoiceHub</h1>
        </Link>
      </div>
    </Header>
  );
};

export default Navbar; 