import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function DashboardStats() {
  const bookings = useSelector((state) => state.bookings);
  console.log(bookings, 'booooo')
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    users: 0,
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    const uniqueHotels = new Set();
    const uniqueRooms = new Set();
    const uniqueUsers = new Set();
    let totalRevenue = 0;

    bookings.data.forEach((booking) => {
      if (booking.rooms?.hotels?.name) {
        uniqueHotels.add(booking.rooms.hotels.name);
      }
      if (booking.rooms?.room_name) {
        uniqueRooms.add(booking.rooms.room_name);
      }
      if (booking.user?.id) {
        uniqueUsers.add(booking.user.id);
      }
      if (booking.payments[0]?.amount) {
        totalRevenue += booking.payments[0].amount;
      }
    });

    setStats({
      hotels: uniqueHotels.size,
      rooms: uniqueRooms.size,
      users: uniqueUsers.size,
      bookings: bookings.length,
      revenue: totalRevenue / 100,
    });
  }, [bookings]);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-medium text-gray-500">🏨 Hotels</h2>
        <p className="text-xl font-bold">{stats.hotels}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-medium text-gray-500">🛏️ Rooms</h2>
        <p className="text-xl font-bold">{stats.rooms}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-medium text-gray-500">🧑‍🤝‍🧑 Users</h2>
        <p className="text-xl font-bold">{stats.users}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-medium text-gray-500">📆 Reservations</h2>
        <p className="text-xl font-bold">{stats.users}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-medium text-gray-500">💸 Revenue</h2>
        <p className="text-xl font-bold">${stats.revenue}</p>
      </div>
    </div>
  );
}
