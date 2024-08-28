import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../App.css';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';
import AppraiseModal from './AppraiseModal';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [authState, setAuthState] = useState(isAuthenticated);
  const navigate = useNavigate();
  const [appraiseModalIsOpen, setAppraiseModalIsOpen] = useState(false);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setAuthState(false);
    navigate('/');
  };

  const openModal = (mode) => {
    setModalMode(mode);
    setModalIsOpen(true);
  };

  const openAppraiseModal = () => {
    setAppraiseModalIsOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <h1>
            <Link to="/">Real Estate App</Link>
          </h1>
          <nav>
            <button onClick={openAppraiseModal}>Appraise the property</button>
            {authState ? (
              <>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button onClick={() => openModal('login')}>Authorize</button>
            )}
          </nav>
        </div>
      </header>
      <AuthModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        initialMode={modalMode}
        onSuccess={() => {
          setModalIsOpen(false); 
          setAuthState(true);
        }}
      />
      <AppraiseModal
        isOpen={appraiseModalIsOpen}
        onRequestClose={() => setAppraiseModalIsOpen(false)}
      />
    </>
  );
};

export default Header;