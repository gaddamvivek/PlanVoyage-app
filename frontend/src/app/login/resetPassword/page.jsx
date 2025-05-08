"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { validatePassword } from "../validatePassword";

export default function ResetPassword() {
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); 
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setMessage("At least 8 characters with a mix of uppercase, lowercase, number, and special symbol.");
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resetPassword`, {
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setIsSuccess(false);
    }
  };

  return (
    <div className="loginBg relative w-full h-screen">
      <div className="flex items-center justify-center ml-auto w-1/2 bg-[#3A2C2280] h-full">
        <div className="bg-[#D9D9D9] bg-opacity-90 p-8 rounded-lg w-[380px] shadow-lg">
          <h2 className="text-black text-2xl font-serif text-center mb-6">Reset Password</h2>

          <div className="relative mb-4">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-3 pr-10 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-all duration-300 ease-in-out"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full p-3 pr-10 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-all duration-300 ease-in-out"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
            </div>
          </div>

          {message && (
            <p className={`text-xs mb-2 ${isSuccess ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleResetPassword}
            className="w-20 bg-[#00800050] text-black font-serif py-2 px-4 rounded-lg ml-31 hover:bg-[#00800080] transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
