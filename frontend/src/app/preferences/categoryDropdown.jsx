"use client";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

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
    "Sports"
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (place) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(selectedPlaces.filter((p) => p !== place));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const isSelected = (place) => selectedPlaces.includes(place);

  return (
    <div className="flex justify-center">
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-between items-center w-64 rounded-md border border-gray-300 shadow-lg px-4 py-2 bg-white text-sm font-medium text-black hover:bg-gray-50"
          onClick={toggleDropdown}
        >
          {selectedPlaces.length > 0
            ? selectedPlaces.join(", ")
            : "Search for Category"}
          <FaCaretDown className="ml-2" />
        </button>

        {isOpen && (
          <div className="w-64 mt-1 rounded-md shadow-lg bg-white border border-gray-300 absolute z-10 max-h-64 overflow-y-auto">
            <div className="py-1">
              {places.map((place, index) => (
                <div key={index} className="flex justify-start items-center px-4 py-1 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected(place)}
                    onChange={() => handleSelect(place)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{place}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
