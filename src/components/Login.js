// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [error, setError] = useState('');

  const handleMetaMaskLogin = async () => {
    try {
      // Request user accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      // Pass the user's Ethereum address to the onLogin callback
      onLogin({ address });
    } catch (error) {
      // Handle authentication failure
      setError('MetaMask authentication failed');
    }
  };

  // Your existing email/password login method
  const handleEmailPasswordLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      onLogin(response.data.user);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '150px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Button to login with MetaMask */}
      <button onClick={handleMetaMaskLogin} style={{ marginTop: '10px', width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#f0ad4e', color: '#fff' }}>Login with MetaMask</button>
    </div>
  );
};

export default Login;
