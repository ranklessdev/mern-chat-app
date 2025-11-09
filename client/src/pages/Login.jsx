import React, { useState } from "react";
import API from "../api/api"; // Corrected path: api is sibling of pages
import { useAuth } from "../context/AuthContext"; // Corrected path: context is sibling of pages
import { Moon, Sun } from 'lucide-react';
import axios from 'axios'; // Ensure axios is imported if not using the wrapped API instance for direct calls

const Login = () => {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // Added name for register
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Apply dark mode class to HTML element
  React.useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('error|Please enter email and password.');
      setIsLoading(false);
      return;
    }

    try {
      // Endpoint: POST /api/auth/login
      const res = await API.post("/auth/login", { email, password });
      
      // Data structure: { _id, name, email, token }
      login(res.data);
      // AuthContext handles token storage and setting axios header

    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      setError(`error|${err.response?.data?.message || 'Login failed. Check server status.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => { 
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('error|Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("error|Passwords don't match.");
      setIsLoading(false);
      return;
    }

    try {
      // Endpoint: POST /api/auth/register
      await API.post("/auth/register", { name, email, password });
      
      setError('success|Account created! Please sign in.');
      setIsSignup(false); 
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error('Signup failed:', err.response?.data?.message || err.message);
      setError(`error|${err.response?.data?.message || 'Signup failed. User may already exist.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [messageType, messageText] = error.split('|');

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

        {/* Visual Message Display */}
        {error && (
            <div className={`px-4 py-3 rounded relative mb-4 border ${
                messageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
            }`} role="alert">
                <span className="block sm:inline">{messageText}</span>
            </div>
        )}

        {/* Form */}
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                }`}
                placeholder="Your Name"
              />
            </div>
          )}
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
            disabled={isLoading}
            className={`w-full p-3 rounded-lg font-semibold transition ${
                isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            } text-white`}
          >
            {isLoading ? (isSignup ? 'Registering...' : 'Signing In...') : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        {/* Switch mode */}
        <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => { setIsSignup(false); setError(''); }}>
                Sign in
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => { setIsSignup(true); setError(''); }}>
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
