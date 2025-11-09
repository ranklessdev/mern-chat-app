// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import axios from 'axios'; // <-- NEW

const API_BASE_URL = 'http://localhost:3000/api'; // <-- REPLACE with your actual backend URL

const LoginForm = ({ setIsAuthenticated, darkMode, setDarkMode, setCurrentUser }) => { // <-- MODIFIED props
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // <-- NEW for error handling

  const handleLogin = async (e) => { // <-- NOW ASYNCHRONOUS
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      // Assuming your backend returns a token and user data on successful login
      const { token, user } = response.data;

      // 1. Store token (e.g., in localStorage for simplicity)
      localStorage.setItem('authToken', token);
      
      // 2. Set the current user data
      setCurrentUser(user);
      
      // 3. Set authenticated state
      setIsAuthenticated(true);

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e) => { // <-- NOW ASYNCHRONOUS
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
      
      alert('Account created! You can now log in.');
      setIsSignup(false); // switch back to sign in
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-400 to-blue-500'
      }`}
    >
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-2xl w-full max-w-md`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
          >
            {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-600" size={24} />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Form */}
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              }`}
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              }`}
              placeholder="••••••••"
            />
          </div>

          {isSignup && (
            <div className="mb-6">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                }`}
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold transition"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Switch mode */}
        <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => setIsSignup(false)}>
                Sign in
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => setIsSignup(true)}>
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;