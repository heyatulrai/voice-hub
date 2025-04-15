import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Space } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/components/Navbar.module.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Hide auth buttons on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <Header className={styles.navbar}>
      <div className={`${styles.container} flex justify-between items-center`}>
        <Link to="/" className={styles.logo}>
          <h1>VoiceHub</h1>
        </Link>
        
        {!isAuthPage && (
          <Space>
            {user ? (
              <Button type="primary" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Space>
                <Button onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
                <Button type="primary" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </Space>
            )}
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar; 