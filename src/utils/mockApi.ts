// src/utils/mockApi.ts
import { GenerationRequest, GenerationResponse } from '../types/types';

/**
 * Mock API for image generation that simulates a real backend
 * @param request - The generation request containing image, prompt, and style
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise that resolves to a GenerationResponse or rejects with an error
 */
export const mockGenerationApi = (
  request: GenerationRequest,
  signal?: AbortSignal
): Promise<GenerationResponse> => {
  return new Promise((resolve, reject) => {
    // Check if the request was aborted before we start
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }

    // Set up abort handler
    const abortHandler = () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Request aborted', 'AbortError'));
    };

    if (signal) {
      signal.addEventListener('abort', abortHandler);
    }

    // Simulate 1-2 second delay
    const delay = 1000 + Math.random() * 1000; // 1000-2000ms
    const timeoutId = setTimeout(() => {
      // Remove abort listener
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }

      // 20% chance of failure
      if (Math.random() < 0.2) {
        reject({ message: "Model overloaded" });
        return;
      }

      // Create a mock "generated" image by applying a filter to the original
      // In a real app, this would be an actual AI-generated image
      const applyMockFilter = (dataUrl: string): Promise<string> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              // Draw original image
              ctx.drawImage(img, 0, 0);
              
              // Apply a simple filter to simulate AI generation
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              // Simple filter based on style
              for (let i = 0; i < data.length; i += 4) {
                // Different transformations based on style
                switch (request.style) {
                  case 'artistic':
                    data[i] = Math.min(255, data[i] * 1.2); // Enhance red
                    data[i + 1] = data[i + 1] * 0.9; // Reduce green
                    break;
                  case 'fantasy':
                    data[i] = data[i] * 0.8; // Reduce red
                    data[i + 2] = Math.min(255, data[i + 2] * 1.3); // Enhance blue
                    break;
                  case 'vintage':
                    data[i] = Math.min(255, data[i] + 20); // Sepia tone
                    data[i + 1] = Math.min(255, data[i + 1] + 10);
                    data[i + 2] = data[i + 2] * 0.9;
                    break;
                  case 'minimalist':
                    // Convert to grayscale
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                    break;
                  // realistic keeps original colors
                }
              }
              
              ctx.putImageData(imageData, 0, 0);
              resolve(canvas.toDataURL());
            } else {
              resolve(dataUrl); // Fallback to original
            }
          };
          img.src = dataUrl;
        });
      };

      // Generate mock response with "processed" image
      applyMockFilter(request.imageDataUrl).then((processedImageUrl) => {
        const response: GenerationResponse = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          imageDataUrl: request.imageDataUrl,
          prompt: request.prompt,
          style: request.style,
          imageUrl: processedImageUrl, // Use the processed image
          createdAt: new Date().toISOString()
        };
        resolve(response);
      });
    }, delay);
  });
};