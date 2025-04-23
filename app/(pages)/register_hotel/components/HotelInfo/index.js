'use client';
import React, { useState } from 'react';

export default function HotelInfo({onNext, onUpdate}) {
  const [hotelName, setHotelName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [petsAllowed, setPetsAllowed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const hotelData = {
      hotelName,
      description,
      price: parseFloat(price),
      rating: parseFloat(rating),
      petsAllowed,
    };
  
    onUpdate(hotelData); // pass the data
    console.log('Hotel Info:', hotelData);
  
    onNext(); // navigate to the next step
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-8 p-6 border rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Hotel Information</h2>

      <input
        type="text"
        className="w-full p-3 border rounded-lg"
        placeholder="Hotel Name"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        required
      />

      <textarea
        className="w-full p-3 border rounded-lg"
        placeholder="Hotel Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full p-3 border rounded-lg"
        placeholder="Price per Night (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min="0"
        step="0.01"
      />

      <input
        type="number"
        className="w-full p-3 border rounded-lg"
        placeholder="Rating (0–5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
        min="0"
        max="10"
        step="0.1"
      />

      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="checkbox"
          checked={petsAllowed}
          onChange={(e) => setPetsAllowed(e.target.checked)}
        />
        Pets Allowed
      </label>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
      >
        Continue
      </button>
    </form>
  );
}
