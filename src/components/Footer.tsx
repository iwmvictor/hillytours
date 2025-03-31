import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';
import { config } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{config.company.name}</h3>
            <p className="text-gray-600 mb-4">
              Your Premier Tourism and Travel Partner
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <a href={`mailto:${config.company.email}`} className="hover:text-primary">
                  {config.company.email}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <a href={`tel:${config.company.phone}`} className="hover:text-primary">
                  {config.company.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Instagram className="h-5 w-5" />
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {config.company.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} {config.company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}