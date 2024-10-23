// Signup.tsx

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/theme-provider';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  // Function to check userId availability
  const checkUserIdAvailability = async () => {
    if (!userId) {
      setIsUserIdAvailable(null);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/user/userId`,
        { userId }
      );
      if (response.data.exists) {
        setIsUserIdAvailable(false);
      } else {
        setIsUserIdAvailable(true);
      }
    } catch (error) {
      console.error('Error checking userId availability:', error);
      setIsUserIdAvailable(null);
    }
  };

  // Function to handle user registration
  const handleSignup = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Prepare data for backend
      const signupData = {
        name,
        userId,
        uid: userCredential.user.uid,
        email,
      };

      // Call backend /signup endpoint5
      await axios.post(
        `${API_URL}/api/v1/user/signup`,
        signupData
      );

      // Sign out 
      await auth.signOut();

      // Proceed to next step
      setStep(2);
      setSuccess('Verification email sent. Please verify your email.');
    } catch (error: any) {
      console.error(error);

      // Check if it's a response from the backend
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        if (statusCode === 409) {
          setError('This user ID is already taken. Please choose another one.');
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const resendVerificationEmail = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccess('Verification email resent. Please check your inbox.');
      } else {
        setError('No user is currently signed in.');
      }
    } catch (error: any) {
      console.error(error);
      setError('Failed to resend verification email.');
    }

    setLoading(false);
  };

  return (
    <div
      className={`p-4 flex flex-col items-center justify-center min-h-full ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <div
        className={`w-full max-w-lg p-8 shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-md`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Sign Up
        </h2>

        {step === 1 && (
          <>
            {/* Name Input */}
            <div className="mb-4">
              <label
                className={`block mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`border-2 w-full p-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700'
                }`}
              />
            </div>

            {/* User ID Input */}
            <div className="mb-4">
              <label
                className={`block mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                User ID
              </label>
              <input
                type="text"
                placeholder="Choose a unique user ID"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setIsUserIdAvailable(null); // Reset availability status on change
                }}
                onBlur={checkUserIdAvailability}
                className={`border-2 w-full p-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700'
                }`}
              />
              {isUserIdAvailable === false && (
                <p className="text-red-600 mt-1">This user ID is already taken.</p>
              )}
              {isUserIdAvailable === true && (
                <p className="text-green-600 mt-1">This user ID is available.</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label
                className={`block mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border-2 w-full p-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700'
                }`}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                className={`block mb-1 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border-2 w-full p-2 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
                }`}
              />
            </div>

            {/* Sign-up Button */}
            <button
              onClick={handleSignup}
              className={`w-full py-2 px-4 rounded-md text-white font-bold mt-4 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              A verification email has been sent to <strong>{email}</strong>.
              Please verify your email to proceed.
            </p>
            <button
              onClick={resendVerificationEmail}
              className={`w-full py-2 px-4 rounded-md text-white font-bold mt-4 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Resending Email..." : "Resend Verification Email"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-green-600 mt-4 text-center">
            <p>{success}</p>
            <p>You can now access your account.</p>
            {/* Redirect to dashboard or login page */}
          </div>
        )}

        {/* Error or Success Messages */}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && step !== 3 && (
          <div className="text-green-600 mt-4 text-center">{success}</div>
        )}

        {/* Link to Signin */}
        <p
          className={`mt-6 text-center ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}