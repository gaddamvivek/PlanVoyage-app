"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthCard from "./AuthCard";
import {validatePassword} from './validatePassword';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const resetForm = () => {
    setForm({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setSubmitError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const { firstname, lastname, email, password, confirmPassword } = form;

    const requiredFields = isSignUp
      ? [firstname, lastname, email, password, confirmPassword]
      : [email, password];

    const allFilled = requiredFields.every((field) => field.trim() !== "");

    if (!allFilled) {
      setSubmitError("All fields are required.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Invalid email address.";
    }

    
    if (isSignUp) {
      if (!validatePassword(password)) { 
        newErrors.password = "At least 8 characters with a mix of uppercase, lowercase, number, and special symbol.";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError("");
  
    if (!validate()) return;
  
    const { firstname, lastname, email, password, confirmPassword } = form;
    try {
      const endpoint = isSignUp ? "signup" : "login";
      const payload = isSignUp ? { firstname, lastname, email, password, confirmPassword } : { email, password };
  
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${endpoint}`, payload);
  
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("loggedIn", "true");

      if (res.data.lastname) {
        localStorage.setItem("lastname", res.data.lastname);
      }
  
      router.push(isSignUp ? "/preferences" : "/destinations");
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Something went wrong");
    }
  };
    
  return (
    <AuthCard
      isSignUp={isSignUp}
      form={form}
      errors={errors}
      error={submitError}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onToggle={() => {
        setIsSignUp(!isSignUp);
        resetForm();
      }}
      onForgotPassword={() => setIsForgotPassword(true)} 
      isForgotPassword={isForgotPassword} 
      setIsForgotPassword={setIsForgotPassword} 
    />
  );
}