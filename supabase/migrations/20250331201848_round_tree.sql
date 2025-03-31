/*
  # Create reviews table and policies

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `provider_response` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on reviews table
    - Add policies for:
      - Public can view reviews
      - Authenticated users can create reviews for services they've booked
      - Providers can respond to reviews on their services
      - Admin can manage all reviews
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  provider_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(service_id, user_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for booked services"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE service_id = reviews.service_id
      AND client_id = auth.uid()
      AND status = 'confirmed'
    )
  );

CREATE POLICY "Providers can respond to reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE id = reviews.service_id
      AND provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE id = reviews.service_id
      AND provider_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage reviews"
  ON public.reviews
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create update trigger
CREATE TRIGGER reviews_updated
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_timestamp();