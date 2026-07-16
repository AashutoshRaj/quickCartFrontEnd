import { useState, useRef } from 'react';
import { Camera, Trash2, Loader } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage } from '../api/userApi';

export default function ProfileImageUpload({ profileImage, onImageChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await uploadProfileImage(formData);
      onImageChange(response.data.data.user.profileImage);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!profileImage?.url) return;

    if (!window.confirm('Delete profile image?')) return;

    setUploading(true);
    try {
      const response = await deleteProfileImage();
      onImageChange(response.data.data.user.profileImage);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {profileImage?.url ? (
        <div className="relative w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 border-primary/20">
          <img
            src={profileImage.url}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 bg-white rounded-full hover:bg-background transition-colors"
            >
              {uploading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Camera size={16} className="text-primary" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader size={24} className="text-primary animate-spin" />
          ) : (
            <Camera size={24} className="text-primary" />
          )}
        </button>
      )}

      {error && (
        <p className="text-red-500 text-xs font-inter mt-2">{error}</p>
      )}
    </div>
  );
}
