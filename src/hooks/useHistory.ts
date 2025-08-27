// src/hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, GenerationResponse } from '../types/types';
import { downscaleImage } from '../utils/imageUtils';

const HISTORY_KEY = 'aiStudioHistory';
const MAX_HISTORY_ITEMS = 5;
const THUMBNAIL_SIZE = 200;

export const useHistory = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setHistoryItems(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load history from localStorage:', error);
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    const saveHistory = () => {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    };

    saveHistory();
  }, [historyItems]);

  const addToHistory = useCallback(async (generationResponse: GenerationResponse) => {
    try {
      // Create a thumbnail from the generated image
      const response = await fetch(generationResponse.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
      
      const thumbnailUrl = await downscaleImage(file, THUMBNAIL_SIZE);

      const historyItem: HistoryItem = {
        id: generationResponse.id,
        imageDataUrl: generationResponse.imageDataUrl,
        prompt: generationResponse.prompt,
        style: generationResponse.style,
        createdAt: generationResponse.createdAt,
        thumbnailUrl
      };

      setHistoryItems(prev => {
        const newHistory = [historyItem, ...prev];
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });

    } catch (error) {
      console.error('Failed to add item to history:', error);
      // Fallback: create history item without thumbnail
      const historyItem: HistoryItem = {
        id: generationResponse.id,
        imageDataUrl: generationResponse.imageDataUrl,
        prompt: generationResponse.prompt,
        style: generationResponse.style,
        createdAt: generationResponse.createdAt,
        thumbnailUrl: generationResponse.imageUrl
      };

      setHistoryItems(prev => {
        const newHistory = [historyItem, ...prev];
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  return {
    historyItems,
    addToHistory,
    clearHistory
  };
};