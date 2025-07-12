import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { PerformanceMonitor, CacheManager } from '@/lib/performance';

// Default data for immediate display
export const defaultPortfolioData = {
  profile: {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate Full-Stack Developer with expertise in modern web technologies. I love creating efficient, scalable solutions and learning new technologies.',
    avatar_url: '/Tj_profile_pics.jpg',
    years_of_experience: 3,
    hero_title: 'Full-Stack Developer',
    hero_description: 'Crafting digital experiences with modern technologies and clean, efficient code',
    github_url: 'https://github.com/johndoe',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    twitter_url: 'https://twitter.com/johndoe',
  },
  projects: [
    {
      id: 'default-1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product management, and payment processing.',
      tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      github_url: 'https://github.com/johndoe/ecommerce',
      live_url: 'https://ecommerce-demo.com',
      featured: true,
      order_index: 1,
    },
    {
      id: 'default-2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      tech_stack: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
      github_url: 'https://github.com/johndoe/taskapp',
      live_url: 'https://taskapp-demo.com',
      featured: true,
      order_index: 2,
    },
    {
      id: 'default-3',
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing projects and skills with smooth animations and optimal performance.',
      tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      github_url: 'https://github.com/johndoe/portfolio',
      live_url: 'https://johndoe.dev',
      featured: true,
      order_index: 3,
    }
  ],
  skills: [
    { id: 'frontend-1', name: 'React', category: 'frontend', order_index: 1 },
    { id: 'frontend-2', name: 'TypeScript', category: 'frontend', order_index: 2 },
    { id: 'frontend-3', name: 'Next.js', category: 'frontend', order_index: 3 },
    { id: 'frontend-4', name: 'Tailwind CSS', category: 'frontend', order_index: 4 },
    { id: 'backend-1', name: 'Node.js', category: 'backend', order_index: 1 },
    { id: 'backend-2', name: 'Express.js', category: 'backend', order_index: 2 },
    { id: 'backend-3', name: 'PostgreSQL', category: 'backend', order_index: 3 },
    { id: 'tools-1', name: 'Git', category: 'tools', order_index: 1 },
    { id: 'tools-2', name: 'Docker', category: 'tools', order_index: 2 },
    { id: 'tools-3', name: 'AWS', category: 'tools', order_index: 3 },
  ],
  education: [
    {
      id: 'default-1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      location: 'New York, NY',
      period: '2018 - 2022',
      description: 'Focused on software engineering, algorithms, and data structures. Graduated Magna Cum Laude with a GPA of 3.8/4.0.',
      achievements: [
        'Dean\'s List for 6 consecutive semesters',
        'President of Computer Science Club',
        'Won University Hackathon 2021'
      ],
      order_index: 1,
    }
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Certified Solutions Architect', year: '2023' },
    { id: 'cert-2', name: 'Google Cloud Professional Developer', year: '2022' },
    { id: 'cert-3', name: 'MongoDB Certified Developer', year: '2022' },
  ]
};

// Fetch all portfolio data in parallel
const fetchPortfolioData = async () => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer('portfolio_data_fetch');

  try {
    // Check cache first
    const cachedData = CacheManager.get('portfolio_data');
    if (cachedData) {
      monitor.endTimer('portfolio_data_fetch');
      return cachedData;
    }

    const [
      { data: profileData },
      { data: projectsData },
      { data: skillsData },
      { data: educationData },
      { data: certificationsData }
    ] = await Promise.all([
      supabase.from('profiles').select('*').limit(1),
      supabase.from('projects').select('*').order('order_index', { ascending: true }),
      supabase.from('skills').select('*').order('order_index', { ascending: true }),
      supabase.from('education').select('*').order('order_index', { ascending: true }),
      supabase.from('certifications').select('*').order('order_index', { ascending: true })
    ]);

    const result = {
      profile: profileData?.[0] || defaultPortfolioData.profile,
      projects: projectsData || defaultPortfolioData.projects,
      skills: skillsData || defaultPortfolioData.skills,
      education: educationData || defaultPortfolioData.education,
      certifications: certificationsData || defaultPortfolioData.certifications,
    };

    // Cache the result
    CacheManager.set('portfolio_data', result, 5 * 60 * 1000); // 5 minutes
    monitor.endTimer('portfolio_data_fetch');
    
    return result;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    monitor.endTimer('portfolio_data_fetch');
    return defaultPortfolioData;
  }
};

export function usePortfolioData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: portfolioData = defaultPortfolioData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['portfolio-data'],
    queryFn: fetchPortfolioData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    // Return default data immediately while fetching
    placeholderData: defaultPortfolioData,
  });

  // Prefetch data on mount for better performance
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['portfolio-data'],
      queryFn: fetchPortfolioData,
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  return {
    profile: portfolioData.profile,
    projects: portfolioData.projects,
    skills: portfolioData.skills,
    education: portfolioData.education,
    certifications: portfolioData.certifications,
    isLoading,
    error,
    refetch,
  };
} 