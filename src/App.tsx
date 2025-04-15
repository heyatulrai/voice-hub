import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import styles from './styles/layout/MainLayout.module.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.mainLayout}>
        <Navbar />
        <main className={styles.pageContent}>
          <div className={styles.container}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App; 