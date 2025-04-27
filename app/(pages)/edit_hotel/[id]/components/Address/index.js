'use client';

import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useState, useRef, useEffect, useCallback } from 'react';

const containerStyle = {
  width: '100%',
  height: '350px',
};

const libraries = ['places'];

export default function AddressRegisterForm({onNext, onUpdate, onUpdate2, defaultData  }) {

  useEffect(() => {
    setFormData({
      country: defaultData.country,
      city: defaultData.city,
      street: defaultData.street,
      postal: defaultData.postal,
    })
  })
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    language: 'en'
  });
  console.log(defaultData, 'defffff')
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    postal: '',
  });

  const [position, setPosition] = useState({ lat: 41.2995, lng: 69.2401 });

  const mapRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const streetRef = useRef(null);

  const updateLocation = (place) => {
    const location = place.geometry?.location;
    if (location) {
      const lat = location.lat();
      const lng = location.lng();
      setPosition({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
    }
  };

  const handlePlaceChange = (type) => {
    const place =
      type === 'country'
        ? countryRef.current.getPlace()
        : type === 'city'
        ? cityRef.current.getPlace()
        : streetRef.current.getPlace();

    const value = place?.formatted_address || place?.name || '';
    setFormData((prev) => ({ ...prev, [type]: value }));

    if (place?.geometry) updateLocation(place);
  };

  const handleDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Coordinates:', position);
    onUpdate(formData)
    onUpdate2(position)
    // Save to Supabase here
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Where is your property located?</h2>

      <Autocomplete
        onLoad={(ref) => (countryRef.current = ref)}
        onPlaceChanged={() => handlePlaceChange('country')}
      >
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Country"
        />
      </Autocomplete>

      <Autocomplete
        onLoad={(ref) => (cityRef.current = ref)}
        onPlaceChanged={() => handlePlaceChange('city')}
      >
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="City"
        />
      </Autocomplete>

      <Autocomplete
        onLoad={(ref) => (streetRef.current = ref)}
        onPlaceChanged={() => handlePlaceChange('street')}
      >
        <input
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Street Address"
        />
      </Autocomplete>

      <input
        name="postal"
        value={formData.postal}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        placeholder="Postal Code"
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={position} draggable onDragEnd={handleDragEnd} />
      </GoogleMap>

      <button
        className="w-full bg-red-600 text-white py-3 rounded mt-4 hover:bg-red-700"
        onClick={() => {
            onNext()
            handleSubmit()
        }}
      >
        Continue
      </button>
    </div>
  );
}
