/**
 * Profile Image Upload Component
 * Handles user profile picture upload and deletion
 */

import React, { useState, useRef } from 'react';
import { Camera, Trash2, Loader } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage } from '../api/userApi.ts';
import type { ProfileImageUploadProps } from '../types/index';

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
      onImageChange?.(
        (response as Record<string, unknown>)?.data?.data?.user
          ?.profileImage as unknown
      );
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
      const response = await deleteProfileImage();
      onImageChange?.(
        (response as Record<string, unknown>)?.data?.data?.user
          ?.profileImage as unknown
      );
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image display or upload prompt */}
      {profileImage?.url ? (
        // Existing image with overlay controls
        <div className="relative w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 border-primary/20">
          <img
            src={profileImage.url}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {/* Hover overlay with action buttons */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 bg-white rounded-full hover:bg-background transition-colors disabled:opacity-50"
              aria-label="Change profile image"
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
              className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
              aria-label="Delete profile image"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        // Upload prompt when no image
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors disabled:opacity-50"
          aria-label="Upload profile image"
        >
          {uploading ? (
            <Loader size={24} className="text-primary animate-spin" />
          ) : (
            <Camera size={24} className="text-primary" />
          )}
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs font-inter mt-2">{error}</p>
      )}
    </div>
  );
}
