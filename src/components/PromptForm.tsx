// src/components/PromptForm.tsx
import React from 'react';
import {useState} from 'react';

interface PromptFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  onSubmit: () => void;
  onAbort: () => void;
  isLoading: boolean;
  imagePreview?: string;
}

const STYLE_OPTIONS = [
  { value: 'editorial', label: 'Editorial' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'vintage', label: 'Vintage' },
];

export const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  onPromptChange,
  selectedStyle,
  onStyleChange,
  onSubmit,
  onAbort,
  isLoading,
  imagePreview,
}) => {
  // Debug: log prop changes
  React.useEffect(() => {
    console.log('[PromptForm] Props changed:', { prompt, selectedStyle, isLoading, imagePreview });
  }, [prompt, selectedStyle, isLoading, imagePreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[PromptForm] Form submitted with:', { prompt, selectedStyle });
    onSubmit();
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('[PromptForm] Style changed to:', e.target.value);
    onStyleChange(e.target.value);
  };

  const handleAbort = () => {
    console.log('[PromptForm] Abort clicked');
    onAbort();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Generation Settings</h2>
      
      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Style Selection */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            id="style"
            value={selectedStyle}
            onChange={handleStyleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            {STYLE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Live Summary */}
        {imagePreview && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Selection</h3>
            <div className="flex items-start space-x-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 truncate">
                  <strong>Prompt:</strong> {prompt || 'None'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Style:</strong> {STYLE_OPTIONS.find(opt => opt.value === selectedStyle)?.label}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
          
          {isLoading && (
            <button
              type="button"
              onClick={handleAbort}
              className="px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Abort
            </button>
          )}
        </div>
      </div>
    </form>
  );
};