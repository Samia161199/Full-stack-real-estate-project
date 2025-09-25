import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Make sure you import Link if using react-router

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send the email to the backend to generate a sign-in token
      const response = await axios.post(
        "http://localhost:3000/users/forgetpassword", 
        { email }
      );
      setMessage("✅ A sign-in link has been sent to your email.");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Show backend error message
      } else {
        setError("❌ An unexpected error occurred."); // Generic fallback error
      }
      console.error(
        "%cError sending sign-in link. Please try again.",
        "color: red; font-weight: bold; background-color: #ffe6e6; padding: 4px; border-radius: 4px;"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-500">Enter your email to receive a sign-in link</p>
        </div>

        {/* Show Error or Success Message */}
        {message && (
          <div className="mb-4 text-center text-sm text-green-600 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleForgetPassword} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Send Sign-In Link
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
