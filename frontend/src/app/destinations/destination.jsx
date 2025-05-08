"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PlaceCard from "./placeCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [hasLikes, setHasLikes] = useState(true);

  const fetchRecommended = async () => {
    const mail = localStorage.getItem("email");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommendDestinations`,
        {
          params: { email: mail },
        }
      );
      setRecommendedDestinations(res.data);
      setHasLikes(res.data.length > 0);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
      setHasLikes(false);
    }
  };

  const fetchData = async () => {
    const mail = localStorage.getItem("email");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/destinations`,
        {
          params: category ? { category } : { email: mail },
        }
      );
      setDestinations(res.data);
      if (!category) {
        fetchRecommended(mail);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="destinationBg w-full min-h-screen relative">
      <div className="bg-[#3A2C2298] w-full h-full pt-0 sm:pt-0">
        <Navbar
          isDestinations={false}
          isPreferences={false}
          isHome={true}
          isProfileShown={true}
        />
        {!category && !hasLikes && (
          <div className="text-white text-2xl font-semibold px-4 pt-6">
            Start liking destinations to see recommendations!
          </div>
        )}
        {/* Recommended Destinations Section */}
        {recommendedDestinations.length > 0 && (
          <div className="p-4">
            <h2 className="text-2xl text-white font-bold mb-4">
              PlanVoyage Recommends You
            </h2>
            <div className="overflow-x-scroll p-4 scrollbar-hide grid grid-rows-1 grid-flow-col gap-5">
              {recommendedDestinations.map((item) => (
                <PlaceCard
                  key={item._id}
                  id={item.id}
                  item_id={item._id}
                  image={item.Image}
                  name={item.Loc_name}
                  maxprice={item.Max_Price}
                  minprice={item.Min_Price}
                  onToggle={fetchRecommended}
                />
              ))}
            </div>
          </div>
        )}

        {/* Your Destinations Section */}
        <div className="p-4">
          <h2 className="text-2xl text-white font-bold mb-4">
            Your Destinations
          </h2>
          <div className="overflow-x-scroll p-4 scrollbar-hide grid grid-rows-1 grid-flow-col gap-5">
            {destinations.map((item) => (
              <PlaceCard
                key={item._id}
                id={item.id}
                item_id={item._id}
                image={item.Image}
                name={item.Loc_name}
                maxprice={item.Max_Price}
                minprice={item.Min_Price}
                onToggle={fetchRecommended}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
