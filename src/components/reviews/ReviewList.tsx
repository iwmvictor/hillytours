import { Star } from 'lucide-react';
import type { Review } from '@/lib/types';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {review.user?.full_name?.[0] || 'U'}
              </div>
              <div>
                <p className="font-medium">{review.user?.full_name}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600">{review.comment}</p>

          {review.provider_response && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <p className="text-sm font-medium">Provider Response:</p>
              <p className="text-sm text-gray-600">{review.provider_response}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}