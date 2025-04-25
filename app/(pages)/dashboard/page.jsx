"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    const fetchStats = async () => {
      setStats({ hotels: 5, rooms: 20, users: 120, bookings: 43 });
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats ? (
          [
            { label: 'Total Hotels', value: stats.hotels },
            { label: 'Total Rooms', value: stats.rooms },
            { label: 'Total Users', value: stats.users },
            { label: 'Active Reservations', value: stats.bookings },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        )}
      </div>

      {/* Tab Section */}
      <Tabs defaultValue="reservations" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="hotels">Hotels & Rooms</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        {/* Reservation Table */}
        <TabsContent value="reservations">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Reservations</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.user.name} <span className="text-xs text-muted-foreground">({r.user.email})</span></TableCell>
                      <TableCell>{r.hotel}</TableCell>
                      <TableCell>{r.room}</TableCell>
                      <TableCell>{r.checkin}</TableCell>
                      <TableCell>{r.checkout}</TableCell>
                      <TableCell>{r.guests}</TableCell>
                      <TableCell>{r.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotels & Rooms */}
        <TabsContent value="hotels">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Hotels & Rooms</h2>
              {hotels.map((hotel) => (
                <div key={hotel.id} className="mb-4">
                  <p className="font-semibold text-base">{hotel.name}</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground">
                    {hotel.rooms.map((room) => (
                      <li key={room.id}>{room.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Management */}
        <TabsContent value="availability">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Availability Management</h2>
              <p className="text-sm text-muted-foreground">Coming soon: calendar view and manual room blocking.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
