'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'

export default function RoomAmenities({ onUpdate, onNext }) {
  const [categories, setCategories] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])

  useEffect(() => {
    const fetchAmenities = async () => {
      const { data: categoryData } = await supabase
        .from('amenity_categories')
        .select('*')

      const { data: amenitiesData } = await supabase
        .from('amenities')
        .select('*')

      const grouped = categoryData.map((cat) => ({
        ...cat,
        amenities: amenitiesData.filter((am) => am.category_id === cat.id),
      }))

      setCategories(grouped)
    }

    fetchAmenities()
  }, [])

  const handleCheckboxChange = (amenityId, isChecked) => {
    setSelectedAmenities((prev) => {
      if (isChecked) return [...prev, amenityId]
      return prev.filter((id) => id !== amenityId)
    })
  }

  const handleSubmit = () => {
    onNext()
    onUpdate(selectedAmenities)
  }
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Select Room Amenities</h2>

      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <h3 className="text-lg font-semibold text-indigo-600">{category.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {category.amenities.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={amenity.id}
                  className="accent-indigo-500"
                  onChange={(e) => handleCheckboxChange(amenity.id, e.target.checked)}
                />
                <span className="text-gray-700">{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}
