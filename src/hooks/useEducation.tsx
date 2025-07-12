
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface Certification {
  id: string;
  name: string;
  year: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }
      setEducation(data as Education[] || []);
    } catch (error) {
      setEducation([]);
      throw error;
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }
      setCertifications(data as Certification[] || []);
    } catch (error) {
      setCertifications([]);
      throw error;
    }
  };

  const addEducation = async (edu: Omit<Education, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        const error = new Error('Not authenticated');
        throw error;
      }

      const { data, error } = await supabase
        .from('education')
        .insert([{ 
          ...edu, 
          user_id: user.data.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      await fetchEducation();
      return { data: data as Education, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    try {
      const { data, error } = await supabase
        .from('education')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      await fetchEducation();
      return { data: data as Education, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      await fetchEducation();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const addCertification = async (cert: Omit<Certification, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        const error = new Error('Not authenticated');
        throw error;
      }

      const { data, error } = await supabase
        .from('certifications')
        .insert([{ 
          ...cert, 
          user_id: user.data.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      await fetchCertifications();
      return { data: data as Certification, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateCertification = async (id: string, updates: Partial<Certification>) => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      await fetchCertifications();
      return { data: data as Certification, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      await fetchCertifications();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchEducation(), fetchCertifications()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    education,
    certifications,
    loading,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    refetch: async () => {
      await Promise.all([fetchEducation(), fetchCertifications()]);
    },
  };
}
