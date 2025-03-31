import { Database } from './database.types';
import { ServiceCategory } from './constants';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'] & {
  category: ServiceCategory;
};

export type Booking = Database['public']['Tables']['bookings']['Row'];

export type ServiceWithProvider = Service & {
  provider: Profile;
};

export type BookingWithService = Booking & {
  service: Service;
  client: Profile;
};

export type ServiceStatus = 'pending' | 'active' | 'inactive';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type NotificationType = 'booking' | 'message' | 'review' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export interface Review {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  comment: string;
  provider_response?: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}