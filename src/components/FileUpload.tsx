// src/components/FileUpload.tsx
import { useState, useCallback, useRef } from 'react';
import { UploadedImage } from '../types/types';
import { validateImageFile, downscaleImage } from '../utils/imageUtils';

interface FileUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidationAndProcessing = useCallback(async (file: File) => {
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    try {
      // Downscale image for preview and processing
      const dataUrl = await downscaleImage(file);
      
      // Set preview
      setPreviewUrl(dataUrl);
      
      // Pass uploaded image to parent
      onImageUpload({
        name: file.name,
        dataUrl,
        originalFile: file
      });
    } catch (err) {
      setError('Failed to process image. Please try another file.');
      console.error('Image processing error:', err);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((file: File) => {
    handleValidationAndProcessing(file);
  }, [handleValidationAndProcessing]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input to allow selecting the same file again
    event.target.value = '';
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  }, [disabled, handleFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const clearFile = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : previewUrl
            ? 'border-gray-300'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        aria-label="Upload image file"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-describedby="file-upload-help"
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-64 object-contain rounded-lg mx-auto mb-4"
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="text-sm">
          {previewUrl ? (
            <p className="text-gray-600">Click to change image</p>
          ) : (
            <>
              <p className="text-gray-700">
                <span className="text-blue-500 hover:text-blue-700 font-medium">Click to upload</span>
                {' or drag and drop'}
              </p>
              <p className="text-gray-500 mt-1">JPG or PNG, max 10MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p id="file-upload-error" className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </p>
      )}

      <p id="file-upload-help" className="text-gray-500 text-xs mt-2">
        Supported formats: JPEG, PNG. Maximum file size: 10MB.
      </p>
    </div>
  );
};