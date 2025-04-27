'use client';

import React, { useState, useEffect } from 'react';
import AddressRegisterForm from './components/Address';
import HotelInfo from './components/HotelInfo';
import AmenitiesForm from './components/AmenitiesForm';
import ImageUploadForm from './components/ImageUploadForm';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function EditHotel() {
  const { id } = useParams()
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    address: {},
    location: {},
    hotelInfo: {},
    amenities: [],
    images: [],
  });


  useEffect(() => {
    const fetchHotelData = async (hotel_id) => {
      setLoading(true);
      const { data, error } = await supabase
        .from("hotels")
        .select()
        .eq("id", hotel_id)
        .single()
      if (error) {
        toast.error("Failed to load hotel data");
        console.error(error);
      } else {
        console.log(data, 'dfdfd')
        // Fill form data correctly
        setFormData({
          address: {
            country: data.address.country,
            city: data.address.region,
            street: data.address.street,
            postal: data.address.postalCode,
          },
          location: {
            lat: data.location.lat,
            lng: data.location.lng,
          },
          hotelInfo: {
            name: data.name,
            description: data.description,
            price: data.price,
            rating: data.rating,
          },
          amenities: data.amenities || [],
          images: data.images || [],
        });
      }
      setLoading(false);
    };

    if (id) {
      fetchHotelData(id);
    }
  }, [id]);

  const updateData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
console.log(formData, 'ffffff')
  const nextStep = () => setStep((s) => s + 1);
  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      {step === 1 && (
        <AddressRegisterForm
          onNext={nextStep}
          onUpdate={(data) => updateData("address", data)}
          onUpdate2={(data) => updateData("location", data)}
          defaultData={formData.address}
          defaultLocation={formData.location}
        />
      )}
      {step === 2 && (
        <HotelInfo
          onNext={nextStep}
          onUpdate={(data) => updateData("hotelInfo", data)}
          defaultData={formData.hotelInfo}
        />
      )}
      {step === 3 && (
        <AmenitiesForm
          onNext={nextStep}
          onUpdate={(data) => updateData("amenities", data)}
          defaultAmenities={formData.amenities}
        />
      )}
      {step === 4 && (
        <ImageUploadForm
          images={formData.images}
          onUpdate={(data) => updateData("images", data)}
          formData={formData}
        />
      )}
    </div>
  );
}
