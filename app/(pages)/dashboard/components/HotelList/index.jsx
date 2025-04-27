"use client";

import { fetchHotelsWithRooms } from '@/app/lib/features/objects/objectsThunks';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "react-toastify";
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function HotelList() {
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  const [editHotel, setEditHotel] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [editName, setEditName] = useState("");
  const { userTable } = useSelector((state) => state.auth);
  const { data: hotels = [], loading } = useSelector((state) => state.objects || {});
  const router = useRouter()
  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(fetchHotelsWithRooms(userTable.guid));
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedHotelId(expandedHotelId === id ? null : id);
  };

  const handleEditHotel = (hotel) => {
    router.push(`/edit_hotel/${hotel.id}`)
    // setEditHotel(hotel);
    // setEditName(hotel.name);
  };

  const handleEditRoom = (room) => {
    setEditRoom(room);
    setEditName(room.room_name);
  };

  const handleDeleteHotel = async (hotelId) => {
    const { error } = await supabase.from('hotels').delete().eq('id', hotelId);
    if (error) {
      toast.error("Failed to delete hotel");
    } else {
      toast.success("Hotel deleted");
      dispatch(fetchHotelsWithRooms(userTable.guid));
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId);
    if (error) {
      toast.error("Failed to delete room");
    } else {
      toast.success("Room deleted");
      dispatch(fetchHotelsWithRooms(userTable.guid));
    }
  };

  const handleSaveEdit = async () => {
    if (editHotel) {
      const { error } = await supabase.from('hotels').update({ name: editName }).eq('id', editHotel.id);
      if (error) {
        toast.error("Failed to update hotel");
      } else {
        toast.success("Hotel updated");
      }
    }

    if (editRoom) {
      const { error } = await supabase.from('rooms').update({ room_name: editName }).eq('id', editRoom.id);
      if (error) {
        toast.error("Failed to update room");
      } else {
        toast.success("Room updated");
      }
    }

    setEditHotel(null);
    setEditRoom(null);
    setEditName("");
    dispatch(fetchHotelsWithRooms(userTable.guid));
  };

  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{hotel.name}</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEditHotel(hotel)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteHotel(hotel.id)}>
                Delete
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toggleExpand(hotel.id)}
              >
                {expandedHotelId === hotel.id ? 'Hide Rooms' : 'Show Rooms'}
              </Button>
            </div>
          </div>

          {expandedHotelId === hotel.id && (
            <ul className="mt-4 space-y-2">
              {hotel.rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex justify-between items-center text-gray-700 bg-gray-50 rounded p-2"
                >
                  {room.room_name}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRoom(room)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Edit Dialog */}
      <Dialog open={!!editHotel || !!editRoom} onOpenChange={() => {
        setEditHotel(null);
        setEditRoom(null);
        setEditName("");
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editHotel ? "Edit Hotel" : "Edit Room"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter new name"
            />

            <Button className="w-full" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
