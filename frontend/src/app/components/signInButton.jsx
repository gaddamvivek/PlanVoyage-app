"use client"; 
import { useRouter } from "next/navigation"; 
  
  export default function SignInButton() {
    const router = useRouter(); 

    return (
      <div className="flex items-center justify-center text-xl font-light text-white p-4 space-x-20">
        <p
          className="border-white border-4 px-12 py-2 rounded-2xl cursor-pointer"
          onClick={() => router.push("/login")} 
        >
          Sign In
        </p>
      </div>
    );
  }
  
  
  
  