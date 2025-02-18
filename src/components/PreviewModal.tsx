import { ParsedSyllabus } from '../types/pdf';
import { formatSectionContent } from '../lib/documentCombiner';
import { useState, useRef, useMemo } from 'react';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameMonth, isWithinInterval, startOfWeek, isSameDay, addDays } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PreviewModalProps {
  syllabuses: Array<{ fileName: string; parsed: ParsedSyllabus }>;
  selectedSections: string[];
  onClose: () => void;
}

export function PreviewModal({ syllabuses, selectedSections, onClose }: PreviewModalProps) {
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const formatSectionName = (section: string) => {
    return section
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    
    setExporting(true);
    try {
      const element = previewRef.current;
      
      // Create PDF with specific dimensions
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      // Function to add a section to PDF
      const addElementToPDF = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );

        // Return true if content goes beyond page height
        return (margin + imgHeight) > pageHeight;
      };

      // Get all sections
      const sections = element.querySelectorAll('[data-section]');
      let isFirstPage = true;

      // Process each section
      for (const section of sections) {
        const sectionType = section.getAttribute('data-section');
        
        if (sectionType === 'schedule') {
          // Handle schedule section with its special pages
          const monthPages = section.querySelectorAll('.schedule-month-page');
          const legendPage = section.querySelector('.schedule-legend-page');

          if (!isFirstPage) pdf.addPage();
          
          // Add legend page
          if (legendPage) {
            await addElementToPDF(legendPage as HTMLElement);
            pdf.addPage();
          }

          // Add each month page
          for (let i = 0; i < monthPages.length; i++) {
            await addElementToPDF(monthPages[i] as HTMLElement);
            if (i < monthPages.length - 1) {
              pdf.addPage();
            }
          }
        } else {
          // Handle regular sections
          if (!isFirstPage) pdf.addPage();
          const needsNewPage = await addElementToPDF(section as HTMLElement);
          if (needsNewPage) {
            pdf.addPage();
          }
        }
        
        isFirstPage = false;
      }

      // Save the PDF
      pdf.save('syllabus-comparison.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('There was an error exporting the PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  function parseScheduleDate(dateStr: string, year = new Date().getFullYear()): Date | null {
    if (dateStr === 'TBD') return null;
    
    try {
      // Convert "1/13" to "01/13/2024" format
      const [month, day] = dateStr.split('/').map(num => parseInt(num));
      return new Date(year, month - 1, day);
    } catch (e) {
      console.warn('Could not parse date:', dateStr);
      return null;
    }
  }

  function getSemesterRange(syllabuses: any[]) {
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    syllabuses.forEach(({ parsed }) => {
      const entries = parsed.schedule?.entries || [];
      
      entries.forEach(entry => {
        let entryDate: Date | null = null;

        if (entry.date && entry.date !== 'TBD') {
          entryDate = parseScheduleDate(entry.date);
        } else if (entry.week) {
          const year = new Date().getFullYear();
          const semesterStart = new Date(year, 0, 8); // Start on second Monday of January
          entryDate = addDays(semesterStart, (entry.week - 1) * 7);
        }

        if (entryDate && !isNaN(entryDate.getTime())) {
          if (!earliestDate || entryDate < earliestDate) earliestDate = entryDate;
          if (!latestDate || entryDate > latestDate) latestDate = entryDate;
        }
      });
    });

    // If no valid dates found, default to Spring semester
    const year = new Date().getFullYear();
    const defaultStart = new Date(year, 0, 8); // Second Monday of January
    const defaultEnd = addMonths(defaultStart, 4); // Go through May

    return {
      start: earliestDate || defaultStart,
      end: latestDate || defaultEnd
    };
  }

  function createSemesterCalendar(startDate: Date, endDate: Date) {
    console.log("Creating calendar from", startDate, "to", endDate);
    const months = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      let weeks = [];
      let currentWeek = [];
      
      // Fill in days before the first of the month
      const firstDayOfWeek = days[0].getDay();
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
      }
      
      // Fill in all days of the month
      days.forEach(day => {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        currentWeek.push(day);
      });
      
      // Fill in days after the last of the month
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
      
      months.push({
        date: currentDate,
        weeks
      });
      
      currentDate = addMonths(currentDate, 1);
    }

    console.log("Generated months:", months.map(m => format(m.date, 'MMMM yyyy')));
    return months;
  }

  // Sort sections to put schedule at the end
  const sortedSections = useMemo(() => {
    return selectedSections.sort((a, b) => {
      if (a === 'schedule') return 1;
      if (b === 'schedule') return -1;
      return 0;
    });
  }, [selectedSections]);

  function renderScheduleSection(syllabuses: any[]) {
    const { start, end } = getSemesterRange(syllabuses);
    const months = createSemesterCalendar(start, end);

    // Define distinct colors for different courses
    const courseColors = [
      'blue',
      'emerald',
      'purple',
      'amber',
      'rose',
      'cyan'
    ];

    return (
      <div className="schedule-container">
        {/* Legend gets its own page with updated colors */}
        <div className="schedule-legend-page">
          <div className="flex flex-wrap gap-4 justify-center p-4">
            <h2 className="w-full text-xl font-bold text-center mb-4">Course Schedule Legend</h2>
            {syllabuses.map(({ parsed, fileName }, index) => (
              <div key={fileName} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full bg-${courseColors[index]}-200`} />
                <span>{parsed.courseInfo?.title || fileName}</span>
              </div>
            ))}
            {/* Add exam legend */}
            <div className="w-full flex items-center gap-2 text-sm justify-center mt-2">
              <div className="w-3 h-3 rounded-full bg-red-100 ring-1 ring-red-500" />
              <span>Exam Day</span>
            </div>
          </div>
        </div>

        {/* Each month gets its own full page */}
        {months.map(({ date, weeks }, monthIndex) => (
          <div key={format(date, 'yyyy-MM')} className="schedule-month-page">
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-bold text-center mb-6">
                {format(date, 'MMMM yyyy')}
              </h3>
              
              <div className="flex-1 border rounded-lg overflow-hidden calendar-grid">
                <div className="grid grid-cols-7 text-center bg-gray-50 border-b">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="divide-y">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 divide-x">
                      {week.map((day, dayIndex) => {
                        if (!day) return <div key={dayIndex} className="p-3 bg-gray-50" />;
                        
                        const allEvents = syllabuses.flatMap((syllabus, syllabusIndex) => {
                          const entries = syllabus.parsed.schedule?.entries || [];
                          const weekNumber = Math.ceil((day.getDate() - 1) / 7) + 1;
                          const isMonday = day.getDay() === 1;
                          
                          return entries
                            .filter(entry => {
                              if (entry.date && entry.date !== 'TBD') {
                                const eventDate = parseScheduleDate(entry.date, date.getFullYear());
                                return eventDate && isSameDay(eventDate, day);
                              }
                              return entry.week === weekNumber && isMonday;
                            })
                            .map(event => ({
                              ...event,
                              courseTitle: syllabus.parsed.courseInfo?.title || syllabus.fileName,
                              colorIndex: syllabusIndex + 1
                            }));
                        });

                        return (
                          <div key={dayIndex} 
                            className={`p-2 min-h-[100px] relative ${
                              !isWithinInterval(day, { start, end }) ? 'bg-gray-50' : ''
                            }`}
                          >
                            <span className="absolute top-1 right-1 text-[10px] text-gray-400">
                              {format(day, 'd')}
                            </span>
                            <div className="mt-3 space-y-1">
                              {allEvents.map((event, eventIndex) => {
                                const isExam = event.topic?.toLowerCase().includes('exam') || 
                                              event.assignments?.toLowerCase().includes('exam');
                                
                                return (
                                  <div 
                                    key={eventIndex}
                                    className={`
                                      text-xs p-1.5 rounded
                                      ${isExam 
                                        ? 'bg-red-100 ring-1 ring-red-500' 
                                        : `bg-${courseColors[event.colorIndex - 1]}-200 hover:bg-${courseColors[event.colorIndex - 1]}-300`
                                      }
                                      transition-colors
                                    `}
                                  >
                                    <div className={`
                                      font-medium text-[10px] 
                                      ${isExam ? 'text-red-900' : `text-${courseColors[event.colorIndex - 1]}-900`}
                                    `}>
                                      {event.courseTitle}
                                    </div>
                                    <div className="font-medium mt-0.5 text-[11px]">
                                      {event.topic}
                                    </div>
                                    {event.assignments && (
                                      <div className={`
                                        mt-0.5 text-[10px]
                                        ${isExam ? 'text-red-900' : `text-${courseColors[event.colorIndex - 1]}-900`}
                                      `}>
                                        {event.assignments}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview Comparison</h2>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`
                px-4 py-2 rounded-md text-white
                ${exporting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }
              `}
            >
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="overflow-auto p-4 flex-1">
          <div 
            ref={previewRef} 
            className="bg-white max-w-[210mm] mx-auto space-y-8"
          >
            {sortedSections.map(section => (
              <div 
                key={section} 
                data-section={section}
                className={`mb-8 print:mb-4 ${section === 'schedule' ? 'schedule-section' : ''}`}
              >
                <h3 className="text-lg font-semibold mb-4 text-center print:text-xl">
                  {formatSectionName(section)}
                </h3>
                
                {section === 'schedule' ? (
                  renderScheduleSection(syllabuses)
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead>
                        <tr>
                          {syllabuses.map(({ parsed }) => (
                            <th
                              key={parsed.courseInfo?.title || 'Untitled'}
                              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-x border-gray-200"
                            >
                              {parsed.courseInfo?.title || 'Untitled'}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          {syllabuses.map(({ fileName, parsed }) => (
                            <td
                              key={fileName}
                              className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900 border-x border-gray-200"
                            >
                              {formatSectionContent(parsed[section], section)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 