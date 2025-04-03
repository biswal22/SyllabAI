'use client';

import { useState, useEffect } from 'react';
import { FiUpload, FiCheckSquare, FiDownload } from 'react-icons/fi';

const steps = [
  {
    icon: FiUpload,
    title: "Upload Syllabuses",
    description: "Upload syllabuses in PDF, DOCX, or TXT formats",
  },
  {
    icon: FiCheckSquare,
    title: "Select Sections",
    description: "Select which sections you want to keep from each syllabus",
  },
  {
    icon: FiDownload,
    title: "Export",
    description: "Preview and download organized syllabus",
  },
];

export function WorkflowAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="grid grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          
          return (
            <div
              key={step.title}
              className={`
                transition-all duration-500 transform
                ${isActive ? 'scale-110' : 'scale-100 opacity-50'}
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}
                `}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`
                  text-lg font-semibold mb-2
                  ${isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 dark:text-gray-500'}
                `}>
                  {step.title}
                </h3>
                <p className={`
                  text-sm
                  ${isActive 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-gray-400 dark:text-gray-500'}
                `}>
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  hidden md:block absolute top-1/2 left-full w-8 h-0.5
                  ${isActive ? 'bg-indigo-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 