
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  order_index: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const fetchSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) throw error;
  
  const typedData = (data || []).map(skill => ({
    ...skill,
    category: skill.category as 'frontend' | 'backend' | 'tools'
  }));
  
  return typedData;
};

const addSkillFn = async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ ...skill, user_id: (await supabase.auth.getUser()).data.user?.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateSkillFn = async ({ id, updates }: { id: string; updates: Partial<Skill> }) => {
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteSkillFn = async (id: string) => {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
};

export function useSkills() {
  const queryClient = useQueryClient();

  const {
    data: skills = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const addSkillMutation = useMutation({
    mutationFn: addSkillFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: updateSkillFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkillFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  return {
    skills,
    loading,
    addSkill: addSkillMutation.mutateAsync,
    updateSkill: updateSkillMutation.mutateAsync,
    deleteSkill: deleteSkillMutation.mutateAsync,
    refetch,
  };
}
