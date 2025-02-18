'use client';

import { useState, useMemo } from 'react';
import { ParsedSyllabus } from '../types/pdf';
import { DefaultButton } from './buttons';
import { PreviewModal } from './PreviewModal';

interface SyllabusSelectorProps {
  syllabuses: Array<{ fileName: string; parsed: ParsedSyllabus }>;
}

export function SyllabusSelector({ syllabuses }: SyllabusSelectorProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Find common sections between all syllabuses
  const commonSections = useMemo(() => {
    return syllabuses.reduce((common, { parsed }, index) => {
      const sections = Object.keys(parsed).filter(key => 
        key !== 'rawContent' && key !== 'pageRanges'
      );
      if (index === 0) return sections;
      return common.filter(section => sections.includes(section));
    }, [] as string[]);
  }, [syllabuses]);

  const handleSelectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => {
      if (checked) {
        return [...prev, section];
      }
      return prev.filter(s => s !== section);
    });
  };

  // Format section name for display
  const formatSectionName = (section: string) => {
    return section
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Sections to Compare</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {commonSections.map(section => (
            <label key={section} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
              <input
                type="checkbox"
                checked={selectedSections.includes(section)}
                onChange={(e) => handleSelectionChange(section, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {formatSectionName(section)}
              </span>
            </label>
          ))}
        </div>

        {syllabuses.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Files to Compare:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {syllabuses.map(({ fileName, parsed }) => (
                <li key={fileName} className="flex items-center space-x-2">
                  <span className="w-4 h-4 flex items-center justify-center">•</span>
                  <span>{parsed.courseInfo?.title || fileName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <DefaultButton
          text="Preview & Export"
          onClick={() => setShowPreview(true)}
          disabled={selectedSections.length === 0}
          className="w-full max-w-md"
        />
      </div>

      {showPreview && (
        <PreviewModal
          syllabuses={syllabuses}
          selectedSections={selectedSections}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
} 