/**
 * Profile Image Upload Component
 * Handles user profile picture upload and deletion
 */

import React, { useState, useRef } from 'react';
import { Camera, Loader, User } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage } from '../api/userApi.ts';
import type { ProfileImageUploadProps } from '../types/index';

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';

/**
 * ProfileImageUpload Component
 *
 * Allows users to upload and manage their profile picture.
 * Supports JPEG, PNG, and WebP formats with 5MB size limit.
 *
 * @param {ProfileImageUploadProps} props - Component props
 * @param {ProfileImage} props.profileImage - Current profile image data
 * @param {Function} props.onImageChange - Callback when image is changed
 * @returns {React.ReactElement} Image upload UI
 *
 * @remarks
 * - Validates file type (JPEG, PNG, WebP)
 * - Validates file size (max 5MB)
 * - Shows loading state during upload
 * - Displays error messages for validation failures
 * - Allows delete with confirmation
 * - Shows upload button overlay on hover
 *
 * @example
 * <ProfileImageUpload
 *   profileImage={{ url: '...' }}
 *   onImageChange={(img) => setImage(img)}
 * />
 */
export default function ProfileImageUpload({
  profileImage,
  onImageChange,
}: ProfileImageUploadProps): React.ReactElement {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection and upload
   */
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    /**
     * Validate file type
     */
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    /**
     * Validate file size (5MB max)
     */
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      /**
       * Upload image to server
       */
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await uploadProfileImage(formData);
      const user = response.data?.user ?? response.data?.data?.user;
      onImageChange?.(user?.profileImage);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle image deletion
   */
  const handleDelete = async (): Promise<void> => {
    if (!profileImage?.url) return;

    if (!window.confirm('Delete profile image?')) return;

    setUploading(true);
    try {
      /**
       * Delete image from server
       */
      await deleteProfileImage();
      onImageChange?.(undefined);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="relative w-28 h-28">
        <div className={`w-28 h-28 rounded-full overflow-hidden bg-primary/10 ring-4 ring-white ${SOFT_SHADOW} flex items-center justify-center`}>
          {profileImage?.url ? (
            <img
              src={profileImage.url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-primary" strokeWidth={1.5} />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <Loader size={22} className="text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Camera badge - always visible, tap to change photo */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,184,0,0.45)] ring-4 ring-white hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50"
          aria-label="Change profile photo"
        >
          <Camera size={16} className="text-white" />
        </button>
      </div>

      {/* Remove photo */}
      {profileImage?.url && (
        <button
          onClick={handleDelete}
          disabled={uploading}
          className="mt-3 text-red-500 font-inter text-xs font-semibold hover:opacity-70 transition-opacity duration-200 disabled:opacity-40"
        >
          Remove Photo
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs font-inter mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
