import Link from 'next/link';
import { FiLinkedin, FiMail, FiGithub } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1">
            <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              SyllabAI
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Simplifying course organization for students through intelligent syllabus management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/combine" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Combine Syllabuses
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="https://linkedin.com/in/aniketbiswal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
                >
                  <FiLinkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:syllabai.help@gmail.com"
                  className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
                >
                  <FiMail className="h-5 w-5" />
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/biswal22/SyllabAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
                >
                  <FiGithub className="h-5 w-5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-base text-gray-400 dark:text-gray-500 text-center">
            © {currentYear} SyllabAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 