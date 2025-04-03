import { PDFUploader } from '../../components/PDFUploader';

export default function CombinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Combine Your Syllabuses
        </h1>
        <PDFUploader />
      </div>
    </div>
  );
} 