"use client"
import { useEffect, useState } from 'react';
import DashboardStats from './components/DashboardStats';
import ReservationTable from './components/ReservationTable';
import HotelList from './components/HotelList';
import AvailabilityManager from './components/AvailabilityManager';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    users: 0,
    bookings: 0,
  });
    const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: hotelsCount } = await supabase
          .from('hotels')
          .select('*', { count: 'exact', head: true });

        const { count: roomsCount } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true });

        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        setStats({
          hotels: hotelsCount || 0,
          rooms: roomsCount || 0,
          users: usersCount || 0,
          bookings: bookingsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error.message);
      }
    };



    const fetchReservations = async () => {
      setReservations([
        {
          id: 'r1',
          user: { name: 'John Doe', email: 'john@example.com' },
          hotel: 'Grand Plaza',
          room: 'Deluxe Suite',
          checkin: '2025-05-01',
          checkout: '2025-05-04',
          guests: 2,
          status: 'confirmed',
        },
      ]);
    };

    const fetchHotels = async () => {
      setHotels([
        {
          id: 'h1',
          name: 'Grand Plaza',
          rooms: [
            { id: 'r1', name: 'Deluxe Suite' },
            { id: 'r2', name: 'Standard Room' },
          ],
        },
      ]);
    };

    fetchStats();
    fetchReservations();
    fetchHotels();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <DashboardStats stats={stats} />

      <Tabs defaultValue="reservations" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="hotels">Hotels & Rooms</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <ReservationTable reservations={reservations} />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelList hotels={hotels} />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
