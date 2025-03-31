import { supabase } from './supabase';
import type { Service, Booking, ServiceStatus, BookingStatus, Review, ReviewFormData } from './types';

export async function createService(service: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServices(status?: ServiceStatus) {
  const query = supabase
    .from('services')
    .select(`
      *,
      provider:profiles(*),
      bookings:bookings(count),
      reviews:reviews(count)
    `);

  if (status) {
    query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getServiceById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      provider:profiles(*),
      bookings:bookings(count),
      reviews:reviews(count)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBooking(booking: Partial<Booking>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select(`
      *,
      service:services(*),
      client:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      service:services(*),
      client:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings(userId: string, role: 'client' | 'provider', status?: BookingStatus) {
  const query = supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      client:profiles(*)
    `);

  if (role === 'client') {
    query.eq('client_id', userId);
  } else if (role === 'provider') {
    query.eq('service.provider_id', userId);
  }

  if (status) {
    query.eq('status', status);
  }

  query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAllBookings(status?: BookingStatus) {
  const query = supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      client:profiles(*)
    `);

  if (status) {
    query.eq('status', status);
  }

  query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: 'client' | 'provider' | 'admin') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createReview(serviceId: string, review: ReviewFormData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ service_id: serviceId, ...review }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReview(id: string, updates: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServiceReviews(serviceId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}