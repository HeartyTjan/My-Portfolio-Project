
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import OptimizedLoader from './OptimizedLoader';

export default function Hero() {
  const { profile, isLoading: profileLoading } = usePortfolioData();
  const [activeCV, setActiveCV] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCV = async () => {
      try {
        const { data } = await supabase
          .from('cv_files')
          .select('file_path')
          .eq('is_active', true)
          .single();
        
        if (data) {
          setActiveCV(data.file_path);
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
      } finally {
        setCvLoading(false);
      }
    };

    fetchActiveCV();
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    if (activeCV) {
      window.open(activeCV, '_blank');
    }
  };

  const heroTitle = profile?.hero_title || 'Software Engineer';
  const heroDescription = profile?.hero_description || 'Crafting digital experiences with modern technologies and clean, efficient code';

  const heroSkeleton = (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-16 md:h-20 w-full max-w-2xl mx-auto mb-6" />
          <Skeleton className="h-6 md:h-8 w-full max-w-xl mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="flex justify-center space-x-6 mb-16">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-8 w-8 mx-auto" />
        </div>
      </div>
    </section>
  );

  return (
    <OptimizedLoader isLoading={profileLoading} skeleton={heroSkeleton} showContentImmediately={true}>
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {activeCV && !cvLoading && (
                <Button size="lg" className="text-lg px-8" onClick={handleDownloadCV}>
                  <Download className="w-5 h-5 mr-2" />
                  Download CV
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => scrollToAbout()}>
                View My Work
              </Button>
            </div>

            <div className="flex justify-center space-x-6 mb-16">
              <a 
                href={profile?.github_url || "#"} 
                className="text-foreground hover:text-primary transition-colors"
                target={profile?.github_url ? "_blank" : undefined}
                rel={profile?.github_url ? "noopener noreferrer" : undefined}
              >
                <Github size={24} />
              </a>
              <a 
                href={profile?.linkedin_url || "#"} 
                className="text-foreground hover:text-primary transition-colors"
                target={profile?.linkedin_url ? "_blank" : undefined}
                rel={profile?.linkedin_url ? "noopener noreferrer" : undefined}
              >
                <Linkedin size={24} />
              </a>
              <a 
                href={profile?.twitter_url || `mailto:${profile?.email || '#'}`} 
                className="text-foreground hover:text-primary transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>

            <button
              onClick={scrollToAbout}
              className="animate-bounce text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowDown size={32} />
            </button>
          </div>
        </div>
      </section>
    </OptimizedLoader>
  );
}
