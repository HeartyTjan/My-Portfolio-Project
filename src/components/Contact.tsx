import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function Contact() {
  const { profile } = useProfile();

  const defaultProfile = {
    full_name: 'HeartyTjan',
    email: 'salamitijani02@gmail.com',
    github_url: 'https://github.com/HeartyTjan',
    linkedin_url: 'https://www.linkedin.com/in/salami-tijani-02/',
  };

  const displayProfile = profile || defaultProfile;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm always interested in new opportunities and collaborations. 
            Let's discuss how we can work together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
              <p className="text-muted-foreground mb-6">
                Whether you have a project in mind, want to discuss potential collaborations, 
                or just want to say hello, I'd love to hear from you!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a 
                    href={`mailto:${displayProfile.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {displayProfile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Available For</h4>
                  <p className="text-muted-foreground">
                    Full-time positions, freelance projects, and collaborations
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" asChild>
                <a href={`mailto:${displayProfile.email}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </a>
              </Button>
            </div>
          </div>

          <Card className="p-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Connect With Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <a
                  href={displayProfile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">GitHub</h4>
                    <p className="text-sm text-muted-foreground">Check out my projects</p>
                  </div>
                </a>

                <a
                  href={displayProfile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">Connect professionally</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 