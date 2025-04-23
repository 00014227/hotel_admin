'use client';

import React, { useState } from 'react';

const AMENITIES = [
  'Free Wi-Fi',
  'Parking',
  'Swimming Pool',
  'Air Conditioning',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Pet Friendly',
  'Room Service',
  '24-Hour Front Desk',
  'Laundry Service',
  'Airport Shuttle',
  'Non-Smoking Rooms',
  'Family Rooms',
  'Kitchenette',
  'TV',
  'Coffee Maker',
  'Hair Dryer',
  'Balcony',
];

export default function AmenitiesForm({ onNext, onUpdate }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedAmenities)
    console.log('Selected amenities:', selectedAmenities);
    onNext(); // Move to next step or complete
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8 p-6 border rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Select Amenities</h2>

      <div className="grid grid-cols-2 gap-3">
        {AMENITIES.map((amenity) => (
          <label key={amenity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
      >
        Continue
      </button>
    </form>
  );
}
