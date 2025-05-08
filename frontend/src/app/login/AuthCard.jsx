"use client";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; 
import ForgotPassword from "./forgotPassword";

export default function AuthCard({isSignUp, form, errors, error, onChange, onSubmit, onToggle, onForgotPassword, isForgotPassword, setIsForgotPassword}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isForgotPassword) {
    return (
      <ForgotPassword 
        form={form} 
        onChange={onChange}
        onSubmit={onSubmit}
        setIsForgotPassword={setIsForgotPassword}
      />
    );
  }

  return (
    <div className={`top-1/2 transform -translate-y-1/2 w-100 
    ${isSignUp ? "h-[580px] mt-130" : "h-[370px] mt-80"} bg-[#D9D9D9] p-8 rounded-xl shadow-lg`}>
      <h2 className="text-black text-2xl font-serif text-center mb-6">
        {isSignUp ? "Create Account" : "Welcome!"}
      </h2>

      {isSignUp && (
        <>
          <input
            type="text"
            name="firstname"
            placeholder="First name"
            className="w-full p-3 mb-2 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.name}
            onChange={onChange}
          />
          {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

          <input
            type="text"
            name="lastname"
            placeholder="Last name"
            className="w-full p-3 mb-2 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.name}
            onChange={onChange}
          />
          {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-3 mb-2 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={form.email}
        onChange={onChange}
      />
      {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}

      <div className="relative w-full mb-2">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full p-3 pr-10 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={form.password}
          onChange={onChange}
        />
        <div
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-all duration-300 ease-in-out"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FaRegEyeSlash size={16} className="transition-all duration-300 ease-in-out" />
          ) : (
            <FaRegEye size={16} className="transition-all duration-300 ease-in-out" />
          )}
        </div>
      </div>
      {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}

      {isSignUp && (
        <>
          <div className="relative w-full mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 text-black font-serif rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={form.confirmPassword}
              onChange={onChange}
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-all duration-300 ease-in-out"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash size={16} className="transition-all duration-300 ease-in-out" />
              ) : (
                <FaRegEye size={16} className="transition-all duration-300 ease-in-out" />
              )}
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mb-2">{errors.confirmPassword}</p>}
        </>
      )}

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      <div className="flex justify-center">
        <button
          className="w-30 bg-[#00800050] text-black font-serif py-2 px-4 rounded-lg hover:bg-[#00800080] transition mt-4"
          onClick={onSubmit}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </div>

      <div className="flex items-center mt-4 mb-8">
      {!isSignUp && (
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-serif text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
      )}

      <h2 className="text-black text-sm font-serif ml-auto">
        {isSignUp ? "Already have an account?" : "New User?"}
        <button
          onClick={onToggle}
          className="text-blue-500 hover:underline ml-2 mr-0"
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </h2>
    </div>

    </div>
  );
}
