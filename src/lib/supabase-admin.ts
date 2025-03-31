import { createClient } from '@supabase/supabase-js';

// This file is only used for initial admin setup
const supabaseUrl = 'https://pnyvdyhgojgaitqunngh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueXZkeWhnb2pnYWl0cXVubmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDk1NzEsImV4cCI6MjA1OTAyNTU3MX0.qQJ-kAPZ_5D-6zXx06U1kVTVciUDR7bpp3SQXz8CRTM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin user
async function createAdminUser() {
  try {
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: 'hillyagency0@gmail.com',
      password: 'Hilly@123',
    });

    if (existingUser?.user) {
      console.log('Admin user already exists');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: 'hillyagency0@gmail.com',
      password: 'Hilly@123',
      options: {
        data: {
          role: 'admin',
          full_name: 'Hilly Agency Admin',
        },
      },
    });

    if (error) {
      throw error;
    }

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the setup
createAdminUser();