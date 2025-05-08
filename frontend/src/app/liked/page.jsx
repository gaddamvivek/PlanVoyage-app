"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "../destinations/placeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LikesPage() {
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPlaces = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/liked-places`,
          { params: { email } }
        );
        setLikedPlaces(response.data.likedPlaces);
        // window.location.reload();
      } catch (err) {
        console.error("Error fetching liked places:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLikedPlaces();
  }, []);

  return (
    <div className="destinationBg w-full min-h-screen relative">
      <div className="bg-[#3A2C2298] w-full h-full">
      <Navbar isHome={true} isDestinations={true} isPreferences={false} isProfileShown={true} />
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Your Liked Places</h1>
          
          {likedPlaces.length === 0 ? (
            <p className="text-white">You haven't liked any places yet.</p>
          ) : (
            <div className="overflow-x-scroll p-4 scrollbar-hide grid grid-rows-2 grid-flow-col gap-5">
              {likedPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  id={place.id}
                  item_id={place._id}
                  image={place.Image}
                  name={place.Loc_name}
                  maxprice={place.Max_Price}
                  minprice={place.Min_Price}
                  onToggle={(removeId) => {
                    setLikedPlaces(prev => prev.filter(p => p.id !== removeId));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}