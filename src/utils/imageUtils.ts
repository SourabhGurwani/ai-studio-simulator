// src/utils/imageUtils.ts

/**
 * Validates if an image file meets requirements (JPG/PNG format, ≤10MB size)
 * @param file - The image file to validate
 * @returns Error message string if invalid, null if valid
 */
export const validateImageFile = (file: File): string | null => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    return 'Please select a JPG or PNG image file.';
  }

  // Check file size (10MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'Image size must be less than 10MB.';
  }

  return null;
};

/**
 * Downscales an image while maintaining aspect ratio
 * @param file - The image file to downscale
 * @param maxSize - Maximum width/height (default: 1920px)
 * @returns Promise that resolves to a downscaled image as a Data URL
 */
export const downscaleImage = (file: File, maxSize: number = 1920): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        
        // Create canvas and downscale image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw downscaled image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL with original file type
        const mimeType = file.type || 'image/jpeg';
        try {
          const dataUrl = canvas.toDataURL(mimeType, 0.9); // 0.9 quality
          resolve(dataUrl);
        } catch (error) {
          reject(new Error('Failed to convert image to data URL'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};