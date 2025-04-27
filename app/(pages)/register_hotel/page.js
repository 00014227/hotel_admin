'use client';

import React, { useState } from 'react';
import AddressRegisterForm from './components/Address';
import HotelInfo from './components/HotelInfo';
import AmenitiesForm from './components/AmenitiesForm';
import ImageUploadForm from './components/ImageUploadForm';

export default function RegisterHotel() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    address: {},
    location: {},
    hotelInfo: {},
    amenities: [],
    images: [],
  });

  const updateData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  console.log(formData, 'finaaal')
  return (
    <div>
      {step === 1 && (
        <AddressRegisterForm
          onNext={nextStep}
          onUpdate={(data) => updateData('address', data)}
          onUpdate2={(data) => updateData('location', data)}
        />
      )}
      {step === 2 && (
        <HotelInfo
          onNext={nextStep}
          onUpdate={(data) => updateData('hotelInfo', data)}
        />
      )}
      {step === 3 && (
        <AmenitiesForm
          onNext={nextStep}
          onUpdate={(data) => updateData('amenities', data)}
        />
      )}
      {step === 4 && (
        <ImageUploadForm
          images={formData.images}
          onUpdate={(data) => updateData('images', data)}
          formData={formData}
        />
      )}
    </div>
  );
}
