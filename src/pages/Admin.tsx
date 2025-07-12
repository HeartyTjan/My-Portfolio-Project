import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import ProfileForm from '@/components/ProfileForm';
import CVUpload from '@/components/CVUpload';
import SkillsManager from '@/components/SkillsManager';
import EducationManager from '@/components/EducationManager';

export default function Admin() {
  const { user, signOut } = useAuth();
  const { projects, loading: projectsLoading, deleteProject } = useProjects();
  const { profile, loading: profileLoading } = useProfile();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (projectsLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Admin</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('/', '_blank')}
            >
              View Portfolio
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="cv">CV Management</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Projects</h2>
                <p className="text-muted-foreground">
                  Manage your portfolio projects
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedProject(null);
                  setShowProjectForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {showProjectForm && (
              <ProjectForm
                project={selectedProject}
                onClose={() => {
                  setShowProjectForm(false);
                  setSelectedProject(null);
                }}
              />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {project.featured && (
                      <Badge variant="secondary" className="w-fit">
                        Featured
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {project.description}
                    </CardDescription>
                    {project.image_url && (
                      <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {(project.tech_stack?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(project.tech_stack?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {projects.length === 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No projects yet. Add your first project to get started!
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedProject(null);
                        setShowProjectForm(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <EducationManager />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Profile</h2>
              <p className="text-muted-foreground">
                Update your personal information
              </p>
            </div>
            <ProfileForm />
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">CV Management</h2>
              <p className="text-muted-foreground">
                Upload and manage your CV file
              </p>
            </div>
            <CVUpload />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
