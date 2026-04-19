import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: 'free' | 'pro' | 'premium';
  role: 'user' | 'organizer' | 'admin';
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from('users')
      .select('id, email, full_name, subscription_tier, role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Error loading profile:', error);
          setProfile(null);
        } else if (data) {
          setProfile(data as UserProfile);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  return { profile, loading };
};
