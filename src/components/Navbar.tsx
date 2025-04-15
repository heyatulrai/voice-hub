import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import styles from '../styles/components/Navbar.module.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
  return (
    <Header className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>VoiceHub</h1>
        </Link>
      </div>
    </Header>
  );
};

export default Navbar; 