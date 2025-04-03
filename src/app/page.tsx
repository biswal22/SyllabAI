import Link from 'next/link';
import { WorkflowAnimation } from '../components/WorkflowAnimation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Syllab<span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Transform multiple course syllabuses into a single, organized view. 
            Save time and stay organized by combining schedules, assignments, and important dates automatically.
          </p>

          <Link 
            href="/combine"
            className="inline-block px-8 py-4 rounded-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <WorkflowAnimation />
      </main>
    </div>
  );
}
