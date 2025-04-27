'use client';

import { supabase } from '@/app/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import postcss from 'postcss';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ImageUploadForm({ formData, onUpdate }) {
  const {id} = useParams()
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userTable } = useSelector((state) => state.auth)
  const router = useRouter()
  console.log(userTable, 'qoto')
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
      const path = `hotel-${Date.now()}/${fileName}`;


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

    const { address, hotelInfo, amenities, location } = formData;
    const { data, error } = await supabase
    .from('hotels')
    .update({
      name: hotelInfo.hotelName,
      description: hotelInfo.description,
      price: hotelInfo.price,
      rating: hotelInfo.rating,
      pets_allowed: hotelInfo.petsAllowed,
      address: {
        full: address.street,
        region: address.city,
        street: address.street,
        country: address.country,
        postalCode: address.postalCode
      },
      location: {
        lat: location.lat,
        lng: location.lng
      },
      amenities: amenities, // array of amenity IDs or objects
      image_url: imageUrls,  // array of URLs
      admin_id: userTable.guid
    })
    .eq('id', id)  // 🛠️ important: find the hotel by ID
  

    if (error) {
      console.error('Hotel creation error:', error.message);
    } else {
      console.log('✅ Hotel created:', data);
      router.push(`/dashboard`);
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
