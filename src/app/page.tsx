import { PDFUploader } from '../components/PDFUploader';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">SyllabAI</h1>
        <p className="text-lg mb-8 text-center text-gray-600">
          Upload your syllabuses from all your classes, select which sections you want to keep, and we'll generate a master syllabus for you!
        </p>
        <PDFUploader />
      </div>
    </div>
  );
}
