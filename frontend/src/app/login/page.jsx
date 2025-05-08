"use client";
import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <div className="loginBg relative w-full h-screen">
      <div className="flex items-center justify-center ml-auto w-1/2 bg-[#3A2C2280] h-full">
        <AuthForm />
      </div>
    </div>
  );
}
