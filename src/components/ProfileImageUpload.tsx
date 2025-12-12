'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Trash2, User } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProfileImageUpload({ 
  currentImage, 
  onImageUpdate, 
  className = '',
  size = 'md'
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onImageUpdate(data.data.profile_image);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/upload/profile-image', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        onImageUpdate(null);
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Profile Image Display */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200`}>
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <User className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={triggerFileSelect}
            disabled={uploading || deleting}
            className="opacity-0 hover:opacity-100 transition-opacity duration-200 p-2 bg-white bg-opacity-90 rounded-full"
            title="Change profile picture"
          >
            <Camera className={`${iconSizes[size]} text-gray-700`} />
          </button>
        </div>

        {/* Loading Overlay */}
        {(uploading || deleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={triggerFileSelect}
          disabled={uploading || deleting}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-4 w-4 mr-1" />
          {uploading ? 'Uploading...' : currentImage ? 'Change' : 'Upload'}
        </button>

        {currentImage && (
          <button
            onClick={handleDelete}
            disabled={uploading || deleting}
            className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {deleting ? 'Deleting...' : 'Remove'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 text-center max-w-xs">
          {error}
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>JPG, PNG or GIF</p>
        <p>Max size: 5MB</p>
      </div>
    </div>
  );
}