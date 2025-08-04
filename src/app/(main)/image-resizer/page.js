'use client';

import { useState, useRef } from 'react';
import { batchResizeImages, resizeImage } from '@/utils/imageResizer';

export default function ImageResizerPage() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState({
    width: 800,
    height: 600,
    mode: 'fit',
    lockAspect: true,
    outputFormat: 'jpeg'
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setResults([]);  // Clear previous results
    setFiles(Array.from(e.target.files));
  };

  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setOptions(prev => {
      const newOptions = { ...prev, [name]: numValue };
      
      // If aspect ratio is locked, calculate the other dimension
      if (prev.lockAspect && files.length > 0) {
        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        img.onload = () => {
          const aspect = img.width / img.height;
          if (name === 'width') {
            newOptions.height = Math.round(numValue / aspect);
          } else if (name === 'height') {
            newOptions.width = Math.round(numValue * aspect);
          }
          setOptions(newOptions);
        };
      }
      
      return newOptions;
    });
  };

  const processImages = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const processedFiles = await batchResizeImages(files, options);
      setResults(processedFiles);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    results.forEach((blob, index) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${files[index].name.replace(/\.[^/.]+$/, '')}.${options.outputFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Image Resizer</h1>
          
          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {/* Resize Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    name="width"
                    value={options.width}
                    onChange={handleDimensionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    name="height"
                    value={options.height}
                    onChange={handleDimensionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="lockAspect"
                  name="lockAspect"
                  checked={options.lockAspect}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="lockAspect" className="ml-2 block text-sm text-gray-700">
                  Lock aspect ratio
                </label>
              </div>
            </div>

            {/* Resize Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resize Mode
              </label>
              <div className="space-y-2">
                {['fit', 'crop', 'stretch'].map((mode) => (
                  <div key={mode} className="flex items-center">
                    <input
                      type="radio"
                      id={mode}
                      name="mode"
                      value={mode}
                      checked={options.mode === mode}
                      onChange={handleOptionChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={mode} className="ml-2 block text-sm text-gray-700 capitalize">
                      {mode} {mode === 'fit' && '(maintain aspect)'}
                      {mode === 'crop' && '(fill dimensions)'}
                      {mode === 'stretch' && '(distort)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['jpeg', 'png', 'webp', 'original'].map((format) => (
                  <div key={format} className="flex items-center">
                    <input
                      type="radio"
                      id={format}
                      name="outputFormat"
                      value={format}
                      checked={options.outputFormat === format}
                      onChange={handleOptionChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={format} className="ml-2 block text-sm text-gray-700 capitalize">
                      {format === 'original' ? 'Original format' : format.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={processImages}
              disabled={files.length === 0 || isProcessing}
              className={`px-4 py-2 rounded-md text-white font-medium ${files.length === 0 || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isProcessing ? 'Processing...' : 'Resize Images'}
            </button>
            
            {results.length > 0 && (
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
              >
                Download All ({results.length})
              </button>
            )}
          </div>

          {/* Preview Area */}
          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((blob, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img 
                      src={URL.createObjectURL(blob)} 
                      alt={`Resized ${files[index].name}`}
                      className="w-full h-auto"
                    />
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs text-gray-600 truncate">
                        {files[index].name} → {Math.round(blob.size/1024)}KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}