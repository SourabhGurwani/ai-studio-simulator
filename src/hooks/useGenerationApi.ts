// src/hooks/useGenerationApi.ts
import { useState, useCallback, useRef } from 'react';
import { GenerationRequest, GenerationResponse } from '../types/types.ts'; // Correct import path
import { mockGenerationApi } from '../utils/mockApi';

interface UseGenerationApiReturn {
  generate: (request: GenerationRequest) => void;
  isLoading: boolean;
  error: string | null;
  data: GenerationResponse | null;
  abort: () => void;
}

interface ApiError {
  message: string;
}

export const useGenerationApi = (): UseGenerationApiReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerationResponse | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('[useGenerationApi] Aborting request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setError('Request cancelled');
    console.log('[useGenerationApi] Request cancelled');
  }, []);

  const generate = useCallback(async (request: GenerationRequest) => {
    // Reset state for new request
    setIsLoading(true);
    setError(null);
    setData(null);
    retryCountRef.current = 0;
    console.log('[useGenerationApi] Starting API call', request);
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const executeRequest = async (): Promise<void> => {
      try {
        const response = await mockGenerationApi(
          request,
          abortControllerRef.current?.signal
        );
        // Success - update state
        setData(response);
        setIsLoading(false);
        abortControllerRef.current = null;
        retryCountRef.current = 0;
        console.log('[useGenerationApi] API call success', response);
      } catch (err) {
        // Handle abort
        if (err instanceof DOMException && err.name === 'AbortError') {
          setIsLoading(false);
          console.log('[useGenerationApi] Request aborted');
          return;
        }
        const apiError = err as ApiError;
        // Check if it's a "Model overloaded" error and we can retry
        if (apiError.message === "Model overloaded" && retryCountRef.current < 3) {
          retryCountRef.current += 1;
          const delay = Math.pow(2, retryCountRef.current - 1) * 1000;
          console.log(`[useGenerationApi] Model overloaded, retrying in ${delay}ms (attempt ${retryCountRef.current})`);
          setTimeout(() => {
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
              executeRequest();
            }
          }, delay);
          return;
        }
        // Final error state
        setError(apiError.message || 'An unexpected error occurred');
        setIsLoading(false);
        abortControllerRef.current = null;
        console.log('[useGenerationApi] API call error', apiError.message);
      }
    };
    executeRequest();
  }, []);

  return {
    generate,
    isLoading,
    error,
    data,
    abort
  };
};