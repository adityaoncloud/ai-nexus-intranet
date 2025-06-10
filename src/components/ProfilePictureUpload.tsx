
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, User } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

const ProfilePictureUpload = ({ currentAvatar, onAvatarChange }: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll simulate the upload process
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, upload to Supabase Storage:
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${userId}/${file.name}`, file);
      
      // For demo purposes, we'll use the preview URL
      if (previewUrl) {
        onAvatarChange(previewUrl);
        console.log('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Picture</span>
        </CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={previewUrl || currentAvatar}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-primary/20"
          />
          <div className="flex-1">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Choose New Picture'}
                  </span>
                </Button>
              </div>
            </Label>
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
