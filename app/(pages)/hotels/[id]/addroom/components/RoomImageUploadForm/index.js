'use client';

import { supabase } from '@/app/lib/supabaseClient';
import { useParams } from 'next/navigation';
import postcss from 'postcss';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function RoomImageUploadForm({ formData, onUpdate }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams()
  const hotelId = params.id
  

  const handleImageChange = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(fileArray);
      onUpdate(fileArray); // Save to parent
    }
  };

  const uploadImages = async () => {
    const urls = [];

    for (const image of images) {
      const fileName = image.name.replace(/\s+/g, '_'); // remove spaces
      const path = `room-${Date.now()}/${fileName}`;


      const { error } = await supabase.storage
        .from('rooms')
        .upload(path, image);

      if (error) {
        console.error('Image upload failed:', error.message);
        continue;
      }

      const { data } = supabase.storage
        .from('rooms')
        .getPublicUrl(path);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const imageUrls = await uploadImages();

    const { roomDetails, roomAmenities, images } = formData;
    const { data, error } = await supabase.from('rooms').insert([
      {
        hotel_id: hotelId,
        price: roomDetails.price,
        type: "Perfect",
        max_guests: roomDetails.max_guest,
        beds: roomDetails.beds,
        bedrooms: roomDetails.bedrooms,
        pets_allowed: true,
        room_name: roomDetails.room_name,
        room_images: imageUrls
      },
    ]);

    if (error) {
      console.error('Room creation error:', error.message);
    } else {
      console.log('✅ Room created:', data);
      // const hotelId = data[0].id;
      // router.push(`/hotels/${hotelId}/add-room`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-8 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center">Upload Room Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full border p-2 rounded"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              className="w-full h-24 object-cover rounded border"
              alt={`Preview ${i}`}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating Hotel...' : 'Finish & Submit'}
      </button>
    </div>
  );
}
