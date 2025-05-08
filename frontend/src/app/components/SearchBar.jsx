"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 w-3/4 mx-auto sm:w-full ">
      <div className={`flex items-center w-full max-w-3xl px-4 py-1 rounded-full border border-white bg-black/40 shadow-md transition-all duration-300`}>
        <input
          type="text"
          placeholder="Search by destination, city, state, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow px-2 py-2 bg-transparent text-white placeholder-white-200 focus:outline-none"
        />
        <button onClick={handleSearch} className="p-2">
          <FiSearch size={24} className="text-white hover:text-blue-500 hover:scale-125 transition-all duration-200 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

