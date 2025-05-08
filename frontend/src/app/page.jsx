import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { redirect } from "next/navigation";

export default function Landing() {
  redirect("/home");
  return (
    <div>
      <a href="/signup"></a>
      <a href="/login"></a>    
    </div>
  );
}
