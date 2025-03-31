import { useState, useEffect } from 'react';
import { Users, Building2, Calendar, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getAllBookings, getAllUsers, updateUserRole, updateBookingStatus } from '@/lib/api';
import type { BookingWithService, Profile, BookingStatus } from '@/lib/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [bookingFilter]);

  async function loadData() {
    try {
      setLoading(true);
      const [bookingsData, usersData] = await Promise.all([
        getAllBookings(bookingFilter as BookingStatus || undefined),
        getAllUsers()
      ]);
      setBookings(bookingsData as BookingWithService[]);
      setUsers(usersData as Profile[]);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  const handleBookingAction = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status} successfully`);
      loadData();
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleUserRoleUpdate = async (userId: string, role: 'client' | 'provider' | 'admin') => {
    try {
      await updateUserRole(userId, role);
      toast.success('User role updated successfully');
      loadData();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalBookings: bookings.length,
    activeProviders: users.filter(u => u.role === 'provider').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, b) => acc + b.total_amount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Providers</p>
              <h3 className="text-2xl font-bold">{stats.activeProviders}</h3>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Bookings</p>
              <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'users' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('users')}
            >
              Users
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </Button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{booking.service.title}</h3>
                      <p className="text-gray-600">
                        Booked by {booking.client.full_name} for{' '}
                        {new Date(booking.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">{user.full_name}</td>
                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleUpdate(
                              user.id,
                              e.target.value as 'client' | 'provider' | 'admin'
                            )}
                            className="border rounded px-2 py-1"
                          >
                            <option value="client">Client</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Booking Management</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value as BookingStatus | '')}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{booking.service.title}</h3>
                      <p className="text-gray-600">
                        {new Date(booking.start_date).toLocaleDateString()} -{' '}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Client: {booking.client.full_name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'confirmed')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'cancelled')}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}