"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PlaceCard({ id, image, item_id, name, maxprice, minprice, onToggle, disableInternalNavigation = false }) {
  const [preference, setPreference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkPreference = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        const [likeRes, dislikeRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/liked-places`,
            {
              params: { email },
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/disliked-places`,
            {
              params: { email },
            }
          ),
        ]);

        const isLiked = likeRes.data.likedPlaces.some((p) => p.id === id);
        const isDisliked = dislikeRes.data.dislikedPlaces.some(
          (p) => p.id === id
        );

        if (isMounted) {
          if (isLiked) setPreference("like");
          else if (isDisliked) setPreference("dislike");
          else setPreference(null);
        }
      } catch (err) {
        console.error("Error checking preference:", err);
      }
    };

    checkPreference();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePreference = async (newPreference) => {
    const email = localStorage.getItem("email");
    if (!email) return;

    setIsLoading(true);
    try {
      const finalPreference =
        preference === newPreference ? "none" : newPreference;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/set-preference`,
        {
          email,
          placeId: id,
          preference: finalPreference,
        }
      );

      setPreference(finalPreference === "none" ? null : finalPreference);

      if (onToggle) onToggle(id);
      toast(
        `Destination ${
          finalPreference === "none" ? "removed from" : "added to"
        } ${newPreference}s !`
      );
    } catch (err) {
      console.error("Preference update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[350px] h-[270px] flex flex-col shadow-lg rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out relative">
      <Image
        src={image.trim()}
        alt={name}
        width={350}
        height={250}
        className="h-[200px] w-full object-cover rounded-t-2xl"
        // onClick={() => router.push("/destinations/" + item_id)}
        onClick={() => {
          if (!disableInternalNavigation) {
            router.push("/destinations/" + item_id);
          }
        }}
      />
      <div className="bg-[#ffffff80] text-black rounded-b-2xl flex justify-between px-4 py-2">
        <div
          onClick={() => {
            if (!disableInternalNavigation) {
              router.push("/destinations/" + item_id);
            }
          }}
        >
          <h3 className="text-[15px] font-bold">{name}</h3>
          <p className="text-base">
            ${minprice} - ${maxprice}
          </p>
        </div>
        <div className="flex gap-3 items-center justify-end pb-2">
          <FaThumbsUp
            onClick={() => handlePreference("like")}
            className={`cursor-pointer text-xl ${
              preference === "like" ? "text-white" : "text-black"
            }`}
          />
          <FaThumbsDown
            onClick={() => handlePreference("dislike")}
            className={`cursor-pointer text-xl ${
              preference === "dislike" ? "text-white" : "text-black"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
