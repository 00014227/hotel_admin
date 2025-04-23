'use client';

import { supabase } from '@/app/lib/supabaseClient';
import React, { useState } from 'react';

export default function ImageUploadForm({ formData, onUpdate }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const ext = image.name.split('.').pop();
      const path = `hotel-${Date.now()}/${image.name}`;

      const { error } = await supabase.storage
        .from('hotels')
        .upload(path, image);

      if (error) {
        console.error('Image upload failed:', error.message);
        continue;
      }

      const { data } = supabase.storage
        .from('hotels')
        .getPublicUrl(path);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const imageUrls = await uploadImages();

    const { address, hotelInfo, amenities } = formData;

    const { data, error } = await supabase.from('hotels').insert([
      {
        name: hotelInfo.name,
        description: hotelInfo.description,
        price: hotelInfo.price,
        rating: hotelInfo.rating,
        pets_allowed: hotelInfo.petsAllowed,
        country: address.country,
        city: address.city,
        street: address.street,
        postal_code: address.postalCode,
        amenities,
        images: imageUrls,
      },
    ]);

    if (error) {
      console.error('Hotel creation error:', error.message);
    } else {
      console.log('✅ Hotel created:', data);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-8 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center">Upload Hotel Images</h2>

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
