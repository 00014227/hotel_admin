import { useParams } from 'next/navigation';
import { useState } from 'react'

export default function RoomDetails({onNext, onUpdate}) {
    const { hotelId } = useParams();
    const [roomData, setRoomData] = useState({
        room_name: '',
        bedrooms: '',
        beds: '',
        max_guest: '',
        price: '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        onNext()
        onUpdate(roomData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow space-y-4">
            <h2 className="text-2xl font-bold text-center">Add Room to Hotel #{hotelId}</h2>

            <input
                type="text"
                name="room_name"
                value={roomData.room_name}
                onChange={handleChange}
                placeholder="Room Name"
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="bedrooms"
                value={roomData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="beds"
                value={roomData.beds}
                onChange={handleChange}
                placeholder="Beds"
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="max_guest"
                value={roomData.max_guest}
                onChange={handleChange}
                placeholder="Max Guests"
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="price"
                value={roomData.price}
                onChange={handleChange}
                placeholder="Price per Night"
                className="w-full border p-2 rounded"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
                {loading ? 'Creating Room...' : 'Add Room'}
            </button>
        </div>)
}
