import { useEffect } from 'react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function DataPreloader() {
  const { refetch } = usePortfolioData();

  useEffect(() => {
    // Preload data immediately when component mounts
    refetch();
  }, [refetch]);

  // This component doesn't render anything visible
  return null;
} 