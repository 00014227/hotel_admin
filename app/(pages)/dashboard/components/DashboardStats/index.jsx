export default function DashboardStats({ stats }) {
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
          <p className="text-xl font-bold">{stats.bookings}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-sm font-medium text-gray-500">💸 Revenue</h2>
          <p className="text-xl font-bold">${stats.revenue || 0}</p>
        </div>
      </div>
    );
  }
  