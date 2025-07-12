
import { useState } from 'react';
import { useSkills, Skill } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function SkillsManager() {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend' as 'frontend' | 'backend' | 'tools',
    order_index: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      if (editingSkill) {
        result = await updateSkill(editingSkill.id, formData);
      } else {
        result = await addSkill(formData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: editingSkill ? 'Skill updated' : 'Skill added',
        description: `The skill has been ${editingSkill ? 'updated' : 'added'} successfully.`,
      });

      setShowForm(false);
      setEditingSkill(null);
      setFormData({ name: '', category: 'frontend', order_index: 0 });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      order_index: skill.order_index,
    });
    setShowForm(true);
  };

  const handleDelete = async (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      const result = await deleteSkill(skillId);
      if (result.error) {
        toast({
          title: 'Error',
          description: 'Failed to delete skill',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Skill deleted',
          description: 'The skill has been deleted successfully.',
        });
      }
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return <div className="flex justify-center p-8">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Skills Management</h3>
          <p className="text-muted-foreground">Manage your technical skills and expertise</p>
        </div>
        <Button
          onClick={() => {
            setEditingSkill(null);
            setFormData({ name: '', category: 'frontend', order_index: 0 });
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., React, Node.js, Docker"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'frontend' | 'backend' | 'tools') =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="tools">Tools & Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {(['frontend', 'backend', 'tools'] as const).map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  category === 'frontend' ? 'bg-blue-500' :
                  category === 'backend' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                {category === 'frontend' ? 'Frontend' :
                 category === 'backend' ? 'Backend' : 'Tools & Services'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skillsByCategory[category]?.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between group">
                    <Badge variant="secondary">{skill.name}</Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(skill.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground text-sm">No skills in this category yet.</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
