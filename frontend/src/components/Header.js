import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../App.css';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [authState, setAuthState] = useState(isAuthenticated);
  const navigate = useNavigate();

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

  return (
    <>
      <header className="header">
        <div className="header-container">
          <h1>
            <Link to="/">Real Estate App</Link>
          </h1>
          <nav>
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
    </>
  );
};

export default Header;