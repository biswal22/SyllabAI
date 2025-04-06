'use client';
import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { UploadedFile } from '../types/pdf';
import { parseSyllabus } from '../lib/syllabusParser';
import { SyllabusSelector } from './SyllabusSelector';
import { FiUploadCloud, FiX, FiLoader } from 'react-icons/fi';

export function PDFUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    
    setIsProcessing(true);
    setRateLimitError(false);
    try {
      const newFiles: UploadedFile[] = [];
      
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        try {
          const parsed = await parseSyllabus(file);
          newFiles.push({
            file,
            parsed,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Check if it's a rate limit error
          if (errorMessage.toLowerCase().includes('rate limit exceeded')) {
            setRateLimitError(true);
          }
          
          newFiles.push({
            file,
            parsed: null,
            error: errorMessage
          });
        }
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== fileName));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const parsedSyllabuses = files
    .filter(f => f.parsed)
    .map(f => ({ fileName: f.file.name, parsed: f.parsed! }));

  return (
    <div className="flex flex-col gap-4">
      {/* Rate Limit Error */}
      {rateLimitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Usage limit reached!</strong>
          <span className="block sm:inline"> You've reached your usage limit. Please try again later.</span>
        </div>
      )}
      
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out relative
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <FiUploadCloud className={`w-12 h-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
          <p className="text-gray-600">
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <FiLoader className="w-4 h-4 animate-spin" />
                Processing files...
              </span>
            ) : (
              <>
                Drop files here or <span className="text-indigo-600 font-medium">browse</span>
                <br />
                <span className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(({ file, error }) => (
            <div
              key={file.name}
              className={`p-4 rounded-lg flex items-center justify-between ${
                error ? 'bg-red-50' : 'bg-green-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
                <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
                  {file.name}
                  {error && (
                    <span className="ml-2 text-xs opacity-75">Error: {error}</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => removeFile(file.name)}
                className="p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Syllabus Selector */}
      {parsedSyllabuses.length > 0 && (
        <SyllabusSelector
          syllabuses={parsedSyllabuses}
        />
      )}
    </div>
  );
}
