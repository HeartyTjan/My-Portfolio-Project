
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Play } from 'lucide-react';

export default function Projects() {
  const { projects, isLoading: loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and contributions
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  const featuredProjects = projects.filter(project => project.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and contributions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-2xl transition-shadow overflow-hidden rounded-2xl border-0 bg-white/90">
              {project.image_url && (
                <div className="relative w-full aspect-[2/1] overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="secondary" className="mt-2 bg-yellow-400/90 text-black font-semibold px-3 py-1 rounded-full w-fit">Featured</Badge>
                    )}
                  </div>
                </div>
              )}
              <CardContent className="space-y-6 p-6">
                <CardDescription className="text-lg text-gray-700 mb-2 min-h-[48px]">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs px-3 py-1 rounded-full bg-gray-100 border-gray-300 shadow-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-center flex-wrap gap-4 mt-4">
                  {project.github_url && (
                    <Button size="lg" variant="outline" asChild className="transition-all shadow hover:shadow-lg border-2 border-gray-300 hover:border-primary text-gray-800 hover:text-primary bg-white">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button size="lg" asChild className="transition-all shadow hover:shadow-lg bg-primary text-white hover:bg-primary/90">
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {(project as any).video_url && (
                    <Button size="lg" variant="outline" asChild className="transition-all shadow hover:shadow-lg border-2 border-gray-300 hover:border-primary text-gray-800 hover:text-primary bg-white">
                      <a href={(project as any).video_url} target="_blank" rel="noopener noreferrer">
                        <Play className="w-5 h-5 mr-2" />
                        Video
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {displayProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
