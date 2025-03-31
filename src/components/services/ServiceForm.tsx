import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createService, updateService } from '@/lib/api';
import type { Service } from '@/lib/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceFormProps {
  initialData?: Service;
  onSuccess?: () => void;
}

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'tours',
    images: initialData?.images || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateService(initialData.id, formData);
        toast.success('Service updated successfully');
      } else {
        await createService(formData);
        toast.success('Service created successfully');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save service');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        >
          {SERVICE_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="url"
          placeholder="Enter image URL"
          onChange={(e) => {
            if (e.target.value) {
              setFormData({
                ...formData,
                images: [...formData.images, e.target.value],
              });
              e.target.value = '';
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        {formData.images.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {formData.images.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="" className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      images: formData.images.filter((_, i) => i !== index),
                    });
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
      </Button>
    </form>
  );
}