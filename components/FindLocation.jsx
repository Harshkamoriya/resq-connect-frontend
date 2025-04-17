import React, { useState } from "react";
import axios from "axios";
import { Input } from "./ui/input";

const LocationSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocations = async (input) => {
    if (input.length < 2) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchLocations(e.target.value);
        }}
        placeholder="Enter a location..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-md">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setQuery(place.display_name)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
