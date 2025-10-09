import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAIImageRecognition } from '../hooks/useAIImageRecognition';

interface AIImageAnalysisProps {
  onAnalysisComplete?: (result: any) => void;
  className?: string;
}

export function AIImageAnalysis({ onAnalysisComplete, className = '' }: AIImageAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeImage, isAnalyzing, result, error } = useAIImageRecognition();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        if (onImageUpload) {
          onImageUpload(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (selectedImage) {
      const analysisResult = await analyzeImage(selectedImage);
      if (analysisResult && onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Image Analysis</h3>
        <p className="text-sm text-gray-600">
          Upload an image or take a photo to automatically identify items
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {!imagePreview ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCameraCapture}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Take Photo</span>
            </button>
            
            <button
              onClick={handleUpload}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Upload Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Selected for analysis"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-medium text-green-800">Analysis Complete</h4>
          </div>
          <div className="text-sm text-green-700">
            <p><strong>Detected Item:</strong> {result.itemName || 'Unknown'}</p>
            <p><strong>Category:</strong> {result.category || 'Uncategorized'}</p>
            <p><strong>Confidence:</strong> {result.confidence ? `${Math.round(result.confidence * 100)}%` : 'N/A'}</p>
            {result.description && (
              <p><strong>Description:</strong> {result.description}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Analysis Failed</h4>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}