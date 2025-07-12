
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Education() {
  const { education, certifications, isLoading: loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="education" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Education & Certifications</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Continuous learning and professional development
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Default data if no entries exist
  const defaultEducation = [
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
      ]
    },
    {
      id: 'default-2',
      degree: 'Full-Stack Web Development Bootcamp',
      institution: 'Tech Academy',
      location: 'San Francisco, CA',
      period: '2017',
      description: 'Intensive 6-month program covering modern web technologies including React, Node.js, and database management.',
      achievements: [
        'Top 5% of graduating class',
        'Built 10+ full-stack applications',
        'Mentor for junior students'
      ]
    }
  ];

  const defaultCertifications = [
    { id: 'cert-1', name: 'AWS Certified Solutions Architect', year: '2023' },
    { id: 'cert-2', name: 'Google Cloud Professional Developer', year: '2022' },
    { id: 'cert-3', name: 'MongoDB Certified Developer', year: '2022' },
    { id: 'cert-4', name: 'React Developer Certification', year: '2021' }
  ];

  const displayEducation = education.length > 0 ? education : defaultEducation;
  const displayCertifications = certifications.length > 0 ? certifications : defaultCertifications;

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Education & Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Continuous learning and professional development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <GraduationCap className="text-primary" />
              Education
            </h3>
            
            <div className="space-y-6">
              {displayEducation.map((edu) => (
                <Card key={edu.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                      <span className="font-medium">{edu.institution}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{edu.description}</p>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Certifications</h3>
            
            <div className="grid gap-4">
              {displayCertifications.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <span className="text-sm text-muted-foreground">{cert.year}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
