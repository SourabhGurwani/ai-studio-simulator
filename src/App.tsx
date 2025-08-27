// src/App.tsx
import { useState, useCallback, useEffect } from 'react';
import { UploadedImage, HistoryItem } from './types/types';
import { useGenerationApi } from './hooks/useGenerationApi';
import { useHistory } from './hooks/useHistory';
import { FileUpload } from './components/FileUpload';
import { PromptForm } from './components/PromptForm';
import { HistorySidebar } from './components/HistorySidebar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';

// Style options for the AI generation
const STYLE_OPTIONS = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vintage', label: 'Vintage' },
];

function App() {
  // State management
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('realistic');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom hooks
  const { generate, isLoading, error, data, abort } = useGenerationApi();
  const { historyItems, addToHistory, clearHistory } = useHistory();

  // Handle successful generation
  useEffect(() => {
    if (data && !isLoading && !error) {
      addToHistory(data);
    }
  }, [data, isLoading, error, addToHistory]);

  // Handle image upload from FileUpload component
  const handleImageUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setUploadError(null);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (!uploadedImage) {
      setUploadError('Please upload an image first');
      return;
    }

    if (!prompt.trim()) {
      setUploadError('Please enter a prompt');
      return;
    }

    setUploadError(null);

    // Create generation request
    const request = {
      imageDataUrl: uploadedImage.dataUrl,
      prompt: prompt.trim(),
      style: selectedStyle
    };

    // Execute generation
    generate(request);
  }, [uploadedImage, prompt, selectedStyle, generate]);

  // Handle history item selection
  const handleHistoryItemSelect = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
    // For a real app, you might want to load the full resolution image
    setUploadedImage({
      name: 'History image',
      dataUrl: item.imageDataUrl,
      originalFile: new File([], 'history-image.jpg')
    });
  }, []);

  // Clear all state
  const handleClearAll = useCallback(() => {
    setUploadedImage(null);
    setPrompt('');
    setSelectedStyle('realistic');
    setUploadError(null);
    abort();
  }, [abort]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AI Studio Simulator</h1>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors"
            aria-label="Clear all inputs and results"
          >
            Clear All
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Preview and Form Section */}
        <main className="flex-1 flex flex-col gap-6" aria-live="polite" aria-busy={isLoading}>
          {/* Image Preview */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Image Preview</h2>
            <FileUpload 
              onImageUpload={handleImageUpload} 
              disabled={isLoading}
            />
            {uploadError && (
              <ErrorAlert 
                message={uploadError} 
                className="mt-4"
                onDismiss={() => setUploadError(null)}
              />
            )}
          </section>

          {/* Generation Form */}
          <PromptForm
            prompt={prompt}
            onPromptChange={setPrompt}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            onSubmit={handleSubmit}
            onAbort={abort}
            isLoading={isLoading}
            imagePreview={uploadedImage?.dataUrl}
          />

          {/* Loading State */}
          {isLoading && (
            <section className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Generating Image</h2>
              <LoadingSpinner size="lg" className="my-4" />
              <p className="text-gray-600">This may take a few moments...</p>
            </section>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <ErrorAlert 
              message={error} 
              onDismiss={() => {/* Clear error from hook if needed */}}
            />
          )}

          {/* Result Display */}
          {data && !isLoading && (
            <section className="bg-white rounded-lg shadow-md p-6" aria-label="Generated result">
              <h2 className="text-xl font-semibold mb-4">Generated Result</h2>
              <div className="flex flex-col items-center">
                <img
                  src={data.imageUrl}
                  alt={`AI generated image based on prompt: ${data.prompt}`}
                  className="max-w-full max-h-96 object-contain rounded-lg mb-4"
                />
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Prompt:</strong> {data.prompt}</p>
                  <p><strong>Style:</strong> {data.style}</p>
                  <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* History Sidebar */}
        <HistorySidebar
          historyItems={historyItems}
          onSelectItem={handleHistoryItemSelect}
          onClearHistory={clearHistory}
        />
      </div>
    </div>
  );
}

export default App;