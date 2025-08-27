// src/types/types.ts
export interface UploadedImage {
  name: string;
  dataUrl: string;
  originalFile: File;
}

export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface GenerationResponse extends GenerationRequest {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export interface HistoryItem extends Omit<GenerationResponse, 'imageUrl'> {
  thumbnailUrl: string;
}