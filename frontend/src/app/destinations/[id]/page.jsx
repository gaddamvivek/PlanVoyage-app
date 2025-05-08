"use client";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PlaceCard from "../placeCard" // ✅ (New import for reusing PlaceCard)
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PlaceDetails() {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [similarDestinations, setSimilarDestinations] = useState([]); // ✅ (New state)

  const { id } = useParams();

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/destinations/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlaceDetails(data);

        // ✅ Fetch similar destinations
        const similarRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/similar/${id}`);
        if (!similarRes.ok) {
          throw new Error("Failed to fetch similar destinations");
        }
        const similarData = await similarRes.json();
        setSimilarDestinations(similarData);

      } catch (error) {
        console.error("Error fetching place details or similar destinations:", error);
      }
    };
    fetchPlaceDetails();
  }, [id]);
  if (!placeDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#BAACA2]">
        <p className="text-2xl text-white">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#BAACA2]">
      <div className=" p-4">
        <Navbar
          isDestinations={true}
          isPreferences={false}
          isHome={false}
          isLiked={false}
          isDisliked={false}
        />
      </div>


      <div className="relative w-full h-64 md:h-80">
        <Image
          src={placeDetails.Image}
          alt={placeDetails.Loc_name}
          layout="fill"
          objectFit="cover"
          className="brightness-90"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white">{placeDetails.Loc_name}</h1>
          <p className="text-white mt-2 text-lg md:text-xl">{placeDetails.Description}</p>
        </div>
      </div>


      <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="text-3xl text-black font-semibold">
            Best to visit in{" "}
            <span className="text-blue-900">
              {placeDetails.Seasons.join(", ")}
            </span>
          </p>

          <div className="flex flex-row gap-35">
            <div>
              <h2 className="text-xl text-black font-semibold">Travel Partner</h2>
              <ul className="list-disc list-inside text-black">
                {placeDetails.Travel_Partner.map((partner, index) => (
                  <li key={index}>{partner}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl text-black font-semibold">Activities</h2>
              <ul className="list-disc list-inside text-black">
                {placeDetails.Activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xl text-black font-semibold">
            Price Range:{" "}
            <span className="text-black">
              ${placeDetails.Min_Price} - ${placeDetails.Max_Price}{" "}
            </span>
          </p>

          <p className="text-xl text-black font-semibold">
            Address: <span className="text-black">{placeDetails.Address}</span>
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center">

          <iframe
            width="400"
            height="350"
            // style="border:0"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY}&q=${placeDetails.Address}`}
            className="rounded-lg shadow-lg object-contain"
          ></iframe>
        </div>
      </div>

      {similarDestinations.length > 0 && (
        <div className="p-4">
          <h2 className="text-2xl text-white font-bold mb-4">Similar Places You May Like</h2>
          <div className="overflow-x-scroll scrollbar-hide grid grid-rows-1 grid-flow-col gap-5">
            {similarDestinations.map((item, index) => (
              <PlaceCard
                key={`similar-${index}`}
                id={item.id}
                item_id={item._id}
                image={item.Image}
                name={item.Loc_name}
                maxprice={item.Max_Price}
                minprice={item.Min_Price}
              />
            ))}
          </div>
        </div>
      )}

      <div className="">
        <Footer />
      </div>
    </div>
  );
}
