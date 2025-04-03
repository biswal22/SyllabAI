import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import syllabLogo from '../assets/syllablogo.png';

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={syllabLogo} 
                alt="SyllabAI Logo" 
                width={120} 
                height={40} 
                className="object-contain" 
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/combine" 
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Combine Syllabi
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 