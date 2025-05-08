import { useState } from "react";
import axios from "axios";

export default function ForgotPassword({ setIsForgotPassword }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgotPassword`, { email });
      setSuccess(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="h-[300px] mt-80 top-1/2 transform -translate-y-1/2 w-100 bg-[#D9D9D9] p-8 rounded-xl shadow-lg">
      <h2 className="text-black text-2xl font-serif text-center mb-6">Forgot Password?</h2>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        className="w-full p-3 mb-2 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {success && <p className="text-green-500 text-xs mb-2">{success}</p>}

      <div className="flex justify-center">
        <button
          className="w-40 bg-[#00800050] text-black font-serif py-2 px-4 rounded-lg hover:bg-[#00800080] transition mt-4"
          onClick={handleForgotPassword}
        >
          Reset Password
        </button>
      </div>
      <div className="flex justify-end mt-4 mb-8">
        <button
          className="text-sm font-serif text-blue-500 hover:underline"
          onClick={() => setIsForgotPassword(false)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
