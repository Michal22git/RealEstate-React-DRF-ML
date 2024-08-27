import React, { useState } from 'react';
import { API_URL } from '../utils/utils';

const RegisterForm = ({ onSuccess, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await fetch(`${API_URL}/api/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          setErrors(errorData);
        } else {
          throw new Error('Registration error');
        }
      } else {
        const data = await response.json();
        console.log('Registration successful:', data);
        onRegisterSuccess();
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An error occurred during registration' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <div style={{ color: 'red' }}>{errors.username[0]}</div>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email[0]}</div>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <div style={{ color: 'red' }}>{errors.password[0]}</div>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;