"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Menu } from "lucide-react";

const places = [
  "Beaches",
  "Mountains",
  "Cities & Lights",
  "Desserts",
  "Islands",
  "Forests & Jungles",
  "Historical & Cultural Sites",
  "Theme Parks & Resorts",
  "Scenic",
  "Sports",
];

export default function Navbar({ isDestinations, isHome, isPreferences }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastname, setLastname] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);
  const menuRef = useRef(null); // NEW: ref for the menu

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      if (email) {
        setIsLoggedIn(true);

        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUser?email=${email}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch user data");
            }
            return res.json();
          })
          .then((data) => {
            if (data.lastname) {
              setLastname(data.lastname);
            }
          })
          .catch((err) => {
            console.error("Error fetching lastname:", err);
          });
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleCategoryClick = (category) => {
    router.push(`/destinations?category=${encodeURIComponent(category)}`);
    setMenuOpen(false);
  };

  return (
    <div className="grid grid-cols-5 items-center justify-center px-2">
      <div className="col-span-1">
        {isLoggedIn && (
          <div className="relative" ref={menuRef}>
            <Menu
              size={32}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white cursor-pointer hover:scale-105 transition-transform duration-200"
            />
            {menuOpen && (
              <div className="absolute z-30 left-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg py-2 max-h-96 overflow-y-auto">
                {places.map((place) => (
                  <p
                    key={place}
                    onClick={() => handleCategoryClick(place)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {place}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-3 flex items-center justify-evenly text-nowrap sm:text-xl font-light text-white p-4">
        {isPreferences && <a href="/preferences">Preferences</a>}
        {isHome && <a href="/home">Home</a>}
        {isDestinations && <a href="/destinations">Destinations</a>}
        <p className="cursor-pointer" onClick={() => router.push("#footer")}>
          About
        </p>
        <p className="cursor-pointer" onClick={() => router.push("#footer")}>
          Contact Us
        </p>
      </div>

      <div className="col-span-1">
        {isLoggedIn && (isHome || isDestinations) && (
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
            {lastname && (
              <span className="hidden sm:block text-white text-[16px] font-medium font-sans tracking-wide animate-fade-in">
                Welcome, <span className="capitalize">{lastname}</span>
              </span>
            )}
            <div className="relative" ref={dropdownRef}>
              <UserCircle
                size={36}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="text-white cursor-pointer hover:scale-105 transition-transform duration-200"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2">
                  {lastname && (
                    <p className="sm:hidden text-center text-[16px] font-medium font-sans tracking-wide animate-fade-in">
                      Welcome, <span className="capitalize">{lastname}</span>
                    </p>
                  )}
                  <p
                    onClick={() => {
                      router.push("/liked");
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Likes
                  </p>
                  <p
                    onClick={() => {
                      router.push("/disliked");
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Dislikes
                  </p>
                  <p
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
