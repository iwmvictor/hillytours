import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { AuthModal } from './auth/AuthModal';
import { NotificationCenter } from './notifications/NotificationCenter';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { config } from '@/lib/config';
import { toast } from 'sonner';

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, setUser, isAdmin, isProvider } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">{config.company.name}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/search">
              <Button variant="ghost">Explore</Button>
            </Link>
            
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <>
                <NotificationCenter />
                {isAdmin() && (
                  <Link to="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                {(isProvider() || !isAdmin()) && (
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}