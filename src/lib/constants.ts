export const SERVICE_CATEGORIES = [
  {
    id: 'tours',
    name: 'Tours & Excursions',
    description: 'Guided tours and unique local experiences',
    icon: 'Compass',
  },
  {
    id: 'events',
    name: 'Events & Entertainment',
    description: 'Cultural events, festivals, and shows',
    icon: 'Calendar',
  },
  {
    id: 'accommodations',
    name: 'Accommodations',
    description: 'Hotels, resorts, and unique stays',
    icon: 'Building',
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Dining',
    description: 'Local cuisine and fine dining experiences',
    icon: 'Utensils',
  },
  {
    id: 'transport',
    name: 'Transportation',
    description: 'Car rentals, transfers, and travel arrangements',
    icon: 'Car',
  },
  {
    id: 'activities',
    name: 'Activities & Adventures',
    description: 'Outdoor activities and adventure sports',
    icon: 'Mountain',
  },
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]['id'];