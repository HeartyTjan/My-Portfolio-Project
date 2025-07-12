
import { Github, Linkedin, Mail, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { profile } = useProfile();
  const [activeCV, setActiveCV] = useState<string | null>(null);

  useEffect(() => {

    const fetchActiveCV = async () => {
      const { data } = await supabase
        .from('cv_files')
        .select('file_path')
        .eq('is_active', true)
        .single();
      
      if (data) {
        setActiveCV(data.file_path);
      }
    };

    fetchActiveCV();
  }, []);

  const handleDownloadCV = () => {
    if (activeCV) {
      window.open(activeCV, '_blank');
    }
  };

  return (
    <footer className="bg-black !bg-black border-t border-gray-800" style={{ backgroundColor: '#000000' }}>
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">
            Let's Connect
          </h3>
          <p className="text-gray-300 mb-6">
            Always interested in new opportunities and collaborations.
          </p>
          <div className="flex space-x-4">
            <a 
              href={profile?.github_url || "#"} 
              className="text-white hover:text-primary transition-colors"
              target={profile?.github_url ? "_blank" : undefined}
              rel={profile?.github_url ? "noopener noreferrer" : undefined}
            >
              <Github size={24} />
            </a>
            <a 
              href={profile?.linkedin_url || "#"} 
              className="text-white hover:text-primary transition-colors"
              target={profile?.linkedin_url ? "_blank" : undefined}
              rel={profile?.linkedin_url ? "noopener noreferrer" : undefined}
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
  
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <nav className="space-y-2">
            <a href="#home" className="block text-gray-300 hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="block text-gray-300 hover:text-primary transition-colors">
              About
            </a>
            <a href="#skills" className="block text-gray-300 hover:text-primary transition-colors">
              Skills
            </a>
            <a href="#projects" className="block text-gray-300 hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#education" className="block text-gray-300 hover:text-primary transition-colors">
              Education
            </a>
          </nav>
        </div>
  
        <div>
          <p className="text-gray-300 mb-4">
            Download my resume to learn more about my experience and skills.
          </p>
          {activeCV ? (
            <Button className="flex items-center gap-2" onClick={handleDownloadCV}>
              <Download size={16} />
              Download CV
            </Button>
          ) : (
            <Button className="flex items-center gap-2" disabled>
              <Download size={16} />
              CV Not Available
            </Button>
          )}
        </div>
      </div>
  
      <div className="border-t border-gray-700 mt-12 pt-8 text-center">
        <p className="text-gray-400 flex items-center justify-center gap-2">
          © {currentYear} HeartyTjan Portfolio. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  
  );
}
