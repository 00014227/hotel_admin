'use client';

import { fetchReservations } from '@/app/lib/features/bookings/bookingsThunks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ReservationTable() {
  const dispatch = useDispatch();
  const { data: bookings = [], loading, error } = useSelector(state => state.bookings);

  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null); // for popup
  const [editMode, setEditMode] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  useEffect(() => {
    let filtered = bookings;

    if (searchName) {
      filtered = filtered.filter((res) =>
        res.user?.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter((res) =>
        new Date(res.check_in_date).toISOString().slice(0, 10) === searchDate
      );
    }

    setFilteredBookings(filtered);
  }, [searchName, searchDate, bookings]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Handle Update Reservation
  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;
  
    console.log('Updating reservation...', {
      id: selectedReservation.id,
      newCheckIn: checkIn,
      newCheckOut: checkOut,
    });
  
    const { data, error } = await supabase
      .from('bookings')
      .update({
        check_in_date: checkIn,
        check_out_date: checkOut,
      })
      .eq('id', selectedReservation.id);
  
    if (error) {
      console.error('Error updating reservation:', error.message);
      // Optional: show toast or error message
    } else {
      console.log('Reservation updated successfully:', data);
      // Optional: refresh reservations
      dispatch(fetchReservations());
    }
  
    setSelectedReservation(null);
    setEditMode(false);
  };

  const handleDeleteReservation = async () => {
    if (!selectedReservation) return;
  
    console.log('Deleting reservation...', selectedReservation.id);
  
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', selectedReservation.id);
  
    if (error) {
      console.error('Error deleting reservation:', error.message);
      // Optional: show toast or error message
    } else {
      console.log('Reservation deleted successfully');
      // Optional: refresh reservations list
      dispatch(fetchReservations());
    }
  
    setSelectedReservation(null);
  };

  const handleSendMessage = () => {
    console.log(selectedReservation, 'reserv')
    if (!selectedReservation?.user?.id) {

      console.log("problem")
    };
  
    console.log('Redirecting to chat with user:', selectedReservation.user.id);
  
    router.push(`/chat/${selectedReservation.user.id}`);
    
    setSelectedReservation(null); // Close the modal
  };
  

  return (
    <div className="mt-6 space-y-4">
      {/* Search Filters */}
      <div className="flex items-end gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Guest Name</label>
          <Input
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Check-in Date</label>
          <Input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setSearchName('');
            setSearchDate('');
          }}
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-2xl bg-white shadow">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Email</th>
              <th className="p-2">Hotel</th>
              <th className="p-2">Room</th>
              <th className="p-2">Check In</th>
              <th className="p-2">Check Out</th>
              <th className="p-2">Status</th>
              <th className="p-2">Payment</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((res) => (
                <tr
                  key={res.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedReservation(res);
                    setCheckIn(res.check_in_date);
                    setCheckOut(res.check_out_date);
                  }}
                >
                  <td className="p-2">{res.user?.name}</td>
                  <td className="p-2">{res.user?.email}</td>
                  <td className="p-2">{res.rooms?.hotels?.name}</td>
                  <td className="p-2">{res.rooms?.room_name}</td>
                  <td className="p-2">{res.check_in_date}</td>
                  <td className="p-2">{res.check_out_date}</td>
                  <td className="p-2">
                    <span
                      className={clsx(
                        'px-2 py-1 rounded-full text-xs font-semibold',
                        {
                          'bg-green-100 text-green-800': res.status === 'confirmed',
                          'bg-yellow-100 text-yellow-800': res.status === 'pending',
                          'bg-red-100 text-red-800': res.status === 'cancelled',
                        }
                      )}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {res.payments?.length > 0
                      ? `$${res.payments[0].amount / 100}`
                      : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-xl font-bold">Reservation Options</h2>

            {!editMode ? (
              <>
                <Button onClick={() => setEditMode(true)} className="w-full">
                  ✏️ Edit Dates
                </Button>
                <Button
                  onClick={handleDeleteReservation}
                  variant="destructive"
                  className="w-full"
                >
                  🗑️ Delete Reservation
                </Button>
                <Button onClick={handleSendMessage} className="w-full">
                  ✉️ Send Message
                </Button>
                <Button variant="outline" onClick={() => setSelectedReservation(null)} className="w-full">
                  Close
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Check In</label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  <label className="text-sm">Check Out</label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdateReservation} className="w-full">
                  ✅ Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)} className="w-full">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
