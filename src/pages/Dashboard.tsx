import { useState, useEffect } from 'react';
import { Calendar, List, MessageSquare, Settings, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceCard } from '@/components/services/ServiceCard';
import { useAuthStore } from '@/lib/store';
import { getServices, getBookings, updateBookingStatus } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { ServiceWithProvider, BookingWithService, BookingStatus } from '@/lib/types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | ''>('');
  const { user, isProvider } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadData();
      subscribeToBookings();
    }

    return () => {
      supabase.channel('bookings').unsubscribe();
    };
  }, [user, bookingFilter]);

  async function loadData() {
    try {
      setLoading(true);
      if (isProvider()) {
        const [servicesData, bookingsData] = await Promise.all([
          getServices(),
          getBookings(user!.id, 'provider', bookingFilter as BookingStatus || undefined)
        ]);
        setServices(servicesData as ServiceWithProvider[]);
        setBookings(bookingsData as BookingWithService[]);
      } else {
        const bookingsData = await getBookings(
          user!.id,
          'client',
          bookingFilter as BookingStatus || undefined
        );
        setBookings(bookingsData as BookingWithService[]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  function subscribeToBookings() {
    const channel = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  const handleBookingAction = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 border-b">
          <Button
            variant={activeTab === 'bookings' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('bookings')}
            className="flex items-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </Button>
          {isProvider() && (
            <Button
              variant={activeTab === 'services' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('services')}
              className="flex items-center space-x-2"
            >
              <List className="h-5 w-5" />
              <span>My Services</span>
            </Button>
          )}
          <Button
            variant={activeTab === 'messages' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('messages')}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-2"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        </div>
        {isProvider() && activeTab === 'services' && (
          <Button
            onClick={() => setShowServiceForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {isProvider() ? 'Booking Requests' : 'My Bookings'}
                </h2>
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

              {bookings.length > 0 ? (
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
                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {isProvider() && booking.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => handleBookingAction(booking.id, 'confirmed')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleBookingAction(booking.id, 'cancelled')}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No bookings found.
                </p>
              )}
            </div>
          )}

          {activeTab === 'services' && isProvider() && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Services</h2>
              {showServiceForm ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ServiceForm
                    onSuccess={() => {
                      setShowServiceForm(false);
                      loadData();
                    }}
                  />
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No services found. Add your first service to get started!
                </p>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Coming Soon!</h3>
                  <p className="text-gray-600">
                    Message functionality will be available soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Booking updates
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Messages
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Service updates
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}