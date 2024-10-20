import { useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../components/theme-provider";

export default function Signin() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    setError(null); 
    setSuccess(null); 
    setLoading(true); 

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {

        navigate("/home"); 
      } else {
        setError("Please verify your email before signing in.");
        await sendEmailVerification(user);
        setSuccess("Verification email resent. Please check your inbox.");
        await auth.signOut(); 
      }
    } catch (error: any) {
      console.error(`Error: ${error}`);
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        default:
          setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
        <div
        className={`p-4 flex flex-col items-center justify-center min-h-full ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`w-full max-w-lg p-8 shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-md`}
        >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Sign In
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label
            className={`block mb-1 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
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
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
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

        {/* Signin Button */}
        <button
          onClick={handleSignin}
          className={`w-full py-2 px-4 rounded-md text-white font-bold mt-4 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Error / Success Messages */}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && (
          <div className="text-green-600 mt-4 text-center">{success}</div>
        )}

        {/* Link to Signup */}
        <p
          className={`mt-6 text-center ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}