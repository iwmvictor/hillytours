import { useState } from 'react';
import { User, Mail, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'primary'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <form className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            {isEditing && (
              <Button variant="outline">Change Photo</Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  defaultValue="•••• •••• •••• 4242"
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}