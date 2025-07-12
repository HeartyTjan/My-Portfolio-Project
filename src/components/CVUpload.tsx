import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CVFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  is_active: boolean;
}

export default function CVUpload() {
  const { toast } = useToast();
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCVFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setCvFiles(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch CV files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file only.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const fileName = `${user.data.user.id}/cv_${Date.now()}.pdf`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cv-files')
        .getPublicUrl(fileName);

      // Deactivate all previous CVs
      await supabase
        .from('cv_files')
        .update({ is_active: false })
        .eq('user_id', user.data.user.id);

      // Insert new CV record
      const { error: insertError } = await supabase
        .from('cv_files')
        .insert({
          user_id: user.data.user.id,
          filename: file.name,
          file_path: publicUrl,
          file_size: file.size,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast({
        title: 'CV uploaded',
        description: 'Your CV has been uploaded successfully.',
      });

      fetchCVFiles();
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (cvId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Deactivate all CVs
      await supabase
        .from('cv_files')
        .update({ is_active: false })
        .eq('user_id', user.data.user.id);

      // Activate selected CV
      const { error } = await supabase
        .from('cv_files')
        .update({ is_active: true })
        .eq('id', cvId);

      if (error) throw error;

      toast({
        title: 'CV activated',
        description: 'This CV is now active and available for download.',
      });

      fetchCVFiles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (cvId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    try {
      // Extract file path from URL for storage deletion
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const storageFilePath = `${user.data.user.id}/${fileName}`;

      // Delete from storage
      await supabase.storage
        .from('cv-files')
        .remove([storageFilePath]);

      // Delete from database
      const { error } = await supabase
        .from('cv_files')
        .delete()
        .eq('id', cvId);

      if (error) throw error;

      toast({
        title: 'CV deleted',
        description: 'The CV has been deleted successfully.',
      });

      fetchCVFiles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading CV files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New CV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-file">Choose PDF file</Label>
              <Input
                id="cv-file"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Uploading CV...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CV Files</CardTitle>
        </CardHeader>
        <CardContent>
          {cvFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No CV files uploaded yet. Upload your first CV above.
            </div>
          ) : (
            <div className="space-y-4">
              {cvFiles.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{cv.filename}</h4>
                      {cv.is_active && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(cv.file_size)} • Uploaded {new Date(cv.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(cv.file_path, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {!cv.is_active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetActive(cv.id)}
                      >
                        Set Active
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cv.id, cv.file_path)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {cvFiles.some(cv => cv.is_active) && (
        <Card>
          <CardHeader>
            <CardTitle>Public CV Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Your active CV is available at this public URL:
            </p>
            <div className="flex gap-2">
              <Input
                value={cvFiles.find(cv => cv.is_active)?.file_path || ''}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(cvFiles.find(cv => cv.is_active)?.file_path || '');
                  toast({ title: 'Copied to clipboard' });
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}