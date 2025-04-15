import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthGuard from './components/auth/AuthGuard';
import { AuthProvider } from './contexts/AuthContext';
import styles from './styles/layout/MainLayout.module.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.mainLayout}>
          <Navbar />
          <main className={`${styles.pageContent} pt-[72px]`}>
            <div className={styles.container}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/profile/:id" 
                  element={
                    <AuthGuard requireAuth>
                      <ProfilePage />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/signin" 
                  element={
                    <AuthGuard>
                      <SignIn />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <AuthGuard>
                      <SignUp />
                    </AuthGuard>
                  } 
                />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 