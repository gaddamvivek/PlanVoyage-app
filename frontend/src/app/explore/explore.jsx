"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PlaceCard from "../destinations/placeCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";

export default function Explore() {
  const [results, setResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setIsLoggedIn(true);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/explore`, {
          params: { search: searchQuery },
        });
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  const handleCardClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const email = localStorage.getItem("email");
    if (!email) {
      setShowLoginPopup(true);
      return;  
    }

    const tagName = e.target.tagName.toLowerCase();
    const classList = e.target.classList;

    if (
      tagName === "svg" ||
      tagName === "path" ||
      classList.contains("text-xl") ||
      classList.contains("cursor-pointer")
    ) {
      return; 
    }
    router.push(`/destinations/${id}`);

  };

  return (
    <div className="searchBg relative w-full min-h-screen">
      <div className="bg-[#3A2C2298] w-full min-h-screen">
        <Navbar isHome={true} isProfileShown={isLoggedIn} />
        <SearchBar />

        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-[#FDFBD4] mb-6 tracking-wide">
            Search Results for: <span className="text-[#EFBF04]">{searchQuery}</span>
          </h1>
        </div>

        {results.length === 0 ? (
          <div className="p-4 text-white text-center">
            No destinations found for "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-x-scroll p-4 scrollbar-hide flex gap-5">
            <div className= "grid grid-rows-2 grid-flow-col auto-cols-max gap-5">
            {results.map((item) => (
              <div
                key={item._id}
                className="cursor-pointer"
                onClick={(e) => handleCardClick(e, item._id)}
              >
                <PlaceCard
                  id={item.id}
                  item_id={item._id}
                  image={item.Image}
                  name={item.Loc_name}
                  maxprice={item.Max_Price}
                  minprice={item.Min_Price}
                  disableInternalNavigation={true}
                />
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
      
      {showLoginPopup && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-t from-[#1f1f1f] to-[#3a3a3a] p-8 rounded-lg w-[400px] shadow-lg">
            <button
              className="absolute top-3 right-3 text-white hover:text-gray-400 text-2xl font-bold"
              onClick={() => setShowLoginPopup(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-red-500 text-2xl font-serif text-center mb-4">Login Required</h2>
            <p className="text-gray-200 text-md font-serif text-center mb-6">
              Log in or sign up to view details and like or dislike places for personalized recommendations.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-semibold text-blue-500 hover:underline hover:text-blue-600 transition-all duration-300"
              >
                Login/SignUp
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}