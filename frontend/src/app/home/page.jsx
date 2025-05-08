"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../public/images/logo.png";
import Navbar from "../components/Navbar";
import SignInButton from "../components/signInButton";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); 

  useEffect(() => {
    setHasMounted(true); 
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  if (!hasMounted) return null; 
  return (
    <div className="homeBg w-full h-screen relative">
      <div className="bg-[#3A2C2285] w-full h-full">
        <Image src={Logo} alt="Logo" width={200} height={200} className="" />
        <div className="">
          <Navbar 
            isDestinations={isLoggedIn} 
            isPreferences={false} 
            //isHome={true} 
            isProfileShown={isLoggedIn} 
          />
        </div>
        <div className="h-screen items-center text-center mt-16">
          <div className="font-extrabold text-white text-3xl sm:text-7xl">START EXPLORING,</div>
          <div className="font-extrabold text-white text-3xl sm:text-7xl">TODAY</div>
           
          <SearchBar />
           {!isLoggedIn && (
            <div className="mb-8">
              <SignInButton />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}