"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Preferences() {
  const router = useRouter(); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [budget, setBudget] = useState("");
  const [travelExperience, setTravelExperience] = useState("");

  async function fetchDestinations() {
    console.log(selectedCategories); 
    console.log(selectedSeasons); 
    console.log(selectedPartners); 
    console.log(selectedActivities);
    const email = localStorage.getItem("email"); 
    try{
      const res = await axios.post( `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/preferences`,{
        email,
        selectedCategories,
        selectedSeasons,
        selectedPartners,
        selectedActivities,
        budget,
        travelExperience
      });
      if(res.status == 200)
      {
        router.push("/destinations"); 
      }
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
  }  

  function removeEmojis(text) {
    return text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/\uFE0F/g, '') // Remove variation selectors
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  }
  const categoryOptions = [
    "Beaches",
    "Mountains",
    "Cities & Lights",
    "Desserts",
    "Forests & Jungles",
    "Historical & Cultural Sites",
    "Theme Parks & Resorts",
    "Scenic",
    "Islands",
    "Sports"
  ];

  const seasonOptions = [
    "☀️Summer",
    "🍂Fall",
    "❄️Winter",
    "🌸Spring",

  ];

  const partnerOptions = ["Solo", "Couple", "Family", "Friends"];
  const activityOptions = ["Shopping", "Adventure", "Safari", "Dining"];

  const toggleSelection = (value, selectedList, setSelectedList, emoji = false) => {
    if(emoji){
      value = removeEmojis(value);
    }
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((item) => item !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  return (
    <div className="preferenceBg w-full min-h-screen relative homeBg">
      <Navbar />
      <div className="p-5"></div>
      <div className="w-9/10 rounded-2xl bg-[#D5B8C7] m-auto p-5">
        <div className="flex items-center justify-center text-black text-2xl font-bold">
          Tell us what you like!
        </div>
        <div className="flex items-center justify-center text-black text-lg mb-4">
          (Note: This will help us suggest the perfect destinations for you!)
        </div>

        <div className="mx-10 text-black text-lg font-semibold">
          <div className="my-5">
            <h2 className="mb-2">Category:</h2>
            <div className="flex flex-wrap gap-4">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    toggleSelection(
                      cat,
                      selectedCategories,
                      setSelectedCategories
                    )
                  }
                  className={`px-4 py-1 cursor-pointer ${
                    selectedCategories.includes(cat)
                      ? "bg-[#A37686] rounded-3xl "
                      : "text-white"
                  } hover:scale-105 `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5">
            <h2 className="mb-2">Seasons:</h2>
            <div className="flex flex-wrap gap-4">
              {seasonOptions.map((season) => (
                <button
                  key={season}
                  onClick={() =>
                    toggleSelection(season, selectedSeasons, setSelectedSeasons, true)
                  }
                  className={`px-4 py-1 backdrop-blur-lg rounded cursor-pointer ${
                    selectedSeasons.includes(removeEmojis(season))
                      ? "bg-[#A37686] rounded-3xl"
                      : "text-white"
                  } hover:scale-105`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5">
            <h2 className="mb-2">Travel Partner:</h2>
            <div className="flex flex-wrap gap-4">
              {partnerOptions.map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    toggleSelection(p, selectedPartners, setSelectedPartners)
                  }
                  className={`px-4 py-1  backdrop-blur-lg rounded cursor-pointer ${
                    selectedPartners.includes(p)
                      ? "bg-[#A37686] rounded-3xl "
                      : "text-white"
                  } hover:scale-105 `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5">
            <h2 className="mb-2">Activities:</h2>
            <div className="flex flex-wrap gap-4">
              {activityOptions.map((a) => (
                <button
                  key={a}
                  onClick={() =>
                    toggleSelection(
                      a,
                      selectedActivities,
                      setSelectedActivities
                    )
                  }
                  className={`px-4 py-1 backdrop-blur-lg rounded cursor-pointer ${
                    selectedActivities.includes(a)
                      ? "bg-[#A37686] rounded-3xl "
                      : "text-white"
                  } hover:scale-105 `}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5">
            <h2 className="mb-2">Budget (USD):</h2>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter Budget in USD"
              className="px-4 py-1 text-gray-600 border border-white/30 backdrop-blur-lg bg-white rounded-xl hover:bg-gray-200 outline-none"
            />
          </div>

          <div className="my-5">
            <h2 className="mb-2">Describe your previous travel experience:</h2>
            <input
              value={travelExperience}
              onChange={(e) => setTravelExperience(e.target.value)}
              className="px-4 py-1 w-full text-black font-light border border-white/30 backdrop-blur-lg bg-white rounded-xl hover:bg-gray-200 outline-none"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 bg-[#10B98180] cursor-pointer hover:scale-x-105 rounded text-black font-medium" onClick ={ () => fetchDestinations()}>
              Suggest Destinations
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
