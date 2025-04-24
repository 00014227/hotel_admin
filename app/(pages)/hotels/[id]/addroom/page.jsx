"use client"

import {useState} from 'react'
import RoomDetails from './components/RoomDetails'
import RoomAmenities from './components/RoomAmenities';
import RoomImageUploadForm from './components/RoomImageUploadForm';

export default function AddRoom() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomDetails: {},
    roomAmenities: {},
    images: []
  })
  const nextStep = () => setStep((s) => s + 1);

  const updateData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  console.log(formData, 'roooooom')
  return (
    <div>
      {step === 1 && (
        <RoomDetails
        onNext={nextStep}
        onUpdate={(data) => updateData("roomDetails", data)}/>
      )}
      {step === 2 && (
        <RoomAmenities onNext= {nextStep}
        onUpdate={(data) => updateData("roomAmenities", data)}
        />
      )}
      {step === 3 && (
        <RoomImageUploadForm 
        formData={formData}
        onUpdate={(data) => updateData('images', data)}/> 
      )}
    </div>
  )
}
