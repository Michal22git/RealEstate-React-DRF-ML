import React, { useState } from 'react';
import Modal from 'react-modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

Modal.setAppElement('#root');

const AuthModal = ({ isOpen, onRequestClose, initialMode, onSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    onRequestClose();
  };

  const handleRegisterSuccess = () => {
    setRegistrationSuccess(true);
    setMode('login');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Authentication Modal"
      className="auth-modal"
      overlayClassName="auth-modal-overlay"
    >
      <button onClick={onRequestClose} className="auth-modal-close">&times;</button>
      <div className="auth-modal-header">
        <button 
          className={`auth-modal-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button 
          className={`auth-modal-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>
      <div className="auth-modal-content">
        {registrationSuccess && mode === 'login' && (
          <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
            Account has been successfully created. You can now log in.
          </div>
        )}
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onRegisterSuccess={handleRegisterSuccess} />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;