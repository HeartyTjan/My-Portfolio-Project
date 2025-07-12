
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Code, Coffee, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const { profile, isLoading: loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  console.log('About component - Profile data:', profile);

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating exceptional digital experiences through code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Hello! I'm {profile?.full_name || 'a Full-Stack Developer'}
            </h3>
            <div className="text-muted-foreground mb-6 leading-relaxed">
              {profile?.bio || (
                <>
                  <p className="mb-4">
                    With {profile?.years_of_experience ? `${profile.years_of_experience} years` : 'over 2 years'} of experience in web development, I specialize in creating 
                    robust, scalable applications using modern technologies. I'm passionate about 
                    clean code, user experience, and continuous learning.
                  </p>
                  <p className="mb-4">
                    My journey started with curiosity about how things work on the web, and it has 
                    evolved into a career where I get to solve complex problems and build amazing 
                    digital products every day.
                  </p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Clean Code</h4>
                  <p className="text-sm text-muted-foreground">Maintainable & Scalable</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Fast Delivery</h4>
                  <p className="text-sm text-muted-foreground">Efficient & Reliable</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Coffee className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Always Learning</h4>
                  <p className="text-sm text-muted-foreground">Growing & Adapting</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Profile'}
                className="aspect-square w-full max-w-md mx-auto rounded-2xl object-cover shadow-2xl"
              />
            ) : (
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {profile?.years_of_experience || '2'}+
                  </div>
                  <div className="text-xl font-semibold">Years Experience</div>
                  <div className="text-muted-foreground mt-4">
                    Turning ideas into reality through code
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
