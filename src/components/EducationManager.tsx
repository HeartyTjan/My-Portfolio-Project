
import { useState } from 'react';
import { useEducation, Education, Certification } from '@/hooks/useEducation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function EducationManager() {
  const { education, certifications, loading, addEducation, updateEducation, deleteEducation, addCertification, updateCertification, deleteCertification } = useEducation();
  const { toast } = useToast();
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    location: '',
    period: '',
    description: '',
    achievements: [] as string[],
    order_index: 0,
  });

  const [certificationForm, setCertificationForm] = useState({
    name: '',
    year: '',
    order_index: 0,
  });

  const [achievementInput, setAchievementInput] = useState('');

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting education form:', educationForm);
      let result;
      if (editingEducation) {
        result = await updateEducation(editingEducation.id, educationForm);
      } else {
        result = await addEducation(educationForm);
      }

      if (result.error) {
        console.error('Education submission error:', result.error);
        throw result.error;
      }

      toast({
        title: editingEducation ? 'Education updated' : 'Education added',
        description: `The education entry has been ${editingEducation ? 'updated' : 'added'} successfully.`,
      });

      setShowEducationForm(false);
      setEditingEducation(null);
      setEducationForm({ degree: '', institution: '', location: '', period: '', description: '', achievements: [], order_index: 0 });
    } catch (error: any) {
      console.error('Education form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save education. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting certification form:', certificationForm);
      let result;
      if (editingCertification) {
        result = await updateCertification(editingCertification.id, certificationForm);
      } else {
        result = await addCertification(certificationForm);
      }

      if (result.error) {
        console.error('Certification submission error:', result.error);
        throw result.error;
      }

      toast({
        title: editingCertification ? 'Certification updated' : 'Certification added',
        description: `The certification has been ${editingCertification ? 'updated' : 'added'} successfully.`,
      });

      setShowCertificationForm(false);
      setEditingCertification(null);
      setCertificationForm({ name: '', year: '', order_index: 0 });
    } catch (error: any) {
      console.error('Certification form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save certification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setEducationForm({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      period: edu.period,
      description: edu.description,
      achievements: edu.achievements,
      order_index: edu.order_index,
    });
    setShowEducationForm(true);
  };

  const handleEditCertification = (cert: Certification) => {
    setEditingCertification(cert);
    setCertificationForm({
      name: cert.name,
      year: cert.year,
      order_index: cert.order_index,
    });
    setShowCertificationForm(true);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      const result = await deleteEducation(id);
      if (result.error) {
        throw result.error;
      }
      toast({
        title: 'Education deleted',
        description: 'The education entry has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete education error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete education. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      const result = await deleteCertification(id);
      if (result.error) {
        throw result.error;
      }
      toast({
        title: 'Certification deleted',
        description: 'The certification has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete certification error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete certification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setEducationForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setEducationForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-4"></div>
        <span>Loading education data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Education & Certifications</h3>
          <p className="text-muted-foreground">Manage your educational background and certifications</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowEducationForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
          <Button onClick={() => setShowCertificationForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Education Form */}
      {showEducationForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{editingEducation ? 'Edit Education' : 'Add New Education'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              setShowEducationForm(false);
              setEditingEducation(null);
              setEducationForm({ degree: '', institution: '', location: '', period: '', description: '', achievements: [], order_index: 0 });
            }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEducationSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    placeholder="University of Technology"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={educationForm.location}
                    onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                    placeholder="New York, NY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Input
                    id="period"
                    value={educationForm.period}
                    onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                    placeholder="2018 - 2022"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                  placeholder="Brief description of your education..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Achievements</Label>
                <div className="flex gap-2">
                  <Input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="Add an achievement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" onClick={addAchievement}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {educationForm.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeAchievement(index)}>
                      {achievement} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={educationForm.order_index}
                  onChange={(e) => setEducationForm({ ...educationForm, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEducationForm(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Certification Form */}
      {showCertificationForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{editingCertification ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              setShowCertificationForm(false);
              setEditingCertification(null);
              setCertificationForm({ name: '', year: '', order_index: 0 });
            }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCertificationSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert_name">Certification Name</Label>
                  <Input
                    id="cert_name"
                    value={certificationForm.name}
                    onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert_year">Year</Label>
                  <Input
                    id="cert_year"
                    value={certificationForm.year}
                    onChange={(e) => setCertificationForm({ ...certificationForm, year: e.target.value })}
                    placeholder="2023"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert_order_index">Order Index</Label>
                <Input
                  id="cert_order_index"
                  type="number"
                  value={certificationForm.order_index}
                  onChange={(e) => setCertificationForm({ ...certificationForm, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCertificationForm(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingCertification ? 'Update Certification' : 'Add Certification')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Education List */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Education</h4>
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{edu.degree}</CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => handleEditEducation(edu)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteEducation(edu.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.institution} • {edu.location}</p>
                  <p className="text-sm text-muted-foreground">{edu.period}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{edu.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {edu.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {education.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No education entries yet.</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Certifications</h4>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <Card key={cert.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">{cert.name}</h5>
                      <span className="text-sm text-muted-foreground">{cert.year}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => handleEditCertification(cert)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteCertification(cert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certifications.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No certifications yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
