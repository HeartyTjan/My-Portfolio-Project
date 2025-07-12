import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  showContentImmediately?: boolean;
}

export default function OptimizedLoader({ 
  isLoading, 
  children, 
  skeleton,
  showContentImmediately = true 
}: OptimizedLoaderProps) {
  // If we want to show content immediately, render children regardless of loading state
  if (showContentImmediately) {
    return <>{children}</>;
  }

  // Otherwise, show skeleton while loading
  if (isLoading) {
    return skeleton || (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
} 