
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  years_of_experience?: number;
  hero_title?: string;
  hero_description?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  created_at: string;
  updated_at: string;
}

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

const updateProfileFn = async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
  const { id, ...updateData } = updates;
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      ...updateData, 
      user_id: userId,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => 
      updateProfileFn({ userId: user!.id, updates }),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user?.id], data);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });

  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            queryClient.setQueryData(['profile', user.id], payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);

  return {
    profile,
    loading,
    updateProfile: updateProfileMutation.mutateAsync,
    refetch,
  };
}
