import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { createBooking } from '@/lib/api';
import type { Service } from '@/lib/types';

interface BookingFormProps {
  service: Service;
  onSuccess?: () => void;
}

export function BookingForm({ service, onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBooking({
        service_id: service.id,
        start_date: new Date(formData.startDate).toISOString(),
        end_date: new Date(formData.endDate).toISOString(),
        total_amount: service.price,
      });
      
      toast.success('Booking created successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create booking');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="datetime-local"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="datetime-local"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          min={formData.startDate}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Service Price</span>
          <span>${service.price}</span>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Book Now'}
      </Button>
    </form>
  );
}