import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Star, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { BookingForm } from '@/components/bookings/BookingForm';
import { getServiceById, getServiceReviews, createReview } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { Review, ServiceWithProvider } from '@/lib/types';

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [service, setService] = useState<ServiceWithProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadServiceDetails();
      subscribeToReviews();
    }

    return () => {
      if (id) {
        supabase.channel(`reviews:${id}`).unsubscribe();
      }
    };
  }, [id]);

  async function loadServiceDetails() {
    try {
      setLoading(true);
      const [serviceData, reviewsData] = await Promise.all([
        getServiceById(id!),
        getServiceReviews(id!)
      ]);
      setService(serviceData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading service details:', error);
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  }

  function subscribeToReviews() {
    supabase
      .channel(`reviews:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `service_id=eq.${id}`
        },
        () => {
          loadServiceDetails(); // Reload reviews when changes occur
        }
      )
      .subscribe();
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    try {
      await createReview(id!, data);
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Service not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={service.images[0] || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"}
          alt={service.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-600 mb-6">
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5" />
              <span>{service.provider.full_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-5 w-5" />
              <span>Available Now</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{service.description}</p>

          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-3xl font-bold">${service.price}</span>
              <span className="text-gray-600">/service</span>
            </div>
            <Button
              size="lg"
              className="flex items-center space-x-2"
              onClick={() => setShowBookingForm(true)}
            >
              <Calendar className="h-5 w-5" />
              <span>Book Now</span>
            </Button>
          </div>

          {showBookingForm && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Make a Booking</h2>
              <BookingForm
                service={service}
                onSuccess={() => {
                  setShowBookingForm(false);
                  toast.success('Booking created successfully');
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {user && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Write Your Review</h3>
            <ReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}