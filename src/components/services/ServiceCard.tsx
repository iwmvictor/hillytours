import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ServiceWithProvider } from '@/lib/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceCardProps {
  service: ServiceWithProvider;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.id === service.category);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={service.images[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium">
          {category?.name}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{service.provider.full_name}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${service.price}</div>
            <Link to={`/service/${service.id}`}>
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}