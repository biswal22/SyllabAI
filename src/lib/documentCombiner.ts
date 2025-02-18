import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ParsedSyllabus, SyllabusSelections } from '../types/pdf';

function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\n/g, ' ')  // Replace newlines with spaces
    .replace(/\r/g, ' ')  // Replace carriage returns
    .replace(/\t/g, ' ')  // Replace tabs
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

export function formatSectionContent(data: any, section: string): string {
  if (!data) return 'No data available';
  
  switch (section) {
    case 'gradeDistribution':
      return formatGradeDistribution(data);
    case 'policies':
      return formatPolicies(data);
    case 'instructorInfo':
      return formatInstructorInfo(data);
    case 'materials':
      return formatMaterials(data);
    case 'schedule':
      return formatSchedule(data);
    default:
      return JSON.stringify(data, null, 2);
  }
}

export async function combineSelectedSections(
  syllabuses: Array<{ fileName: string; parsed: ParsedSyllabus }>,
  selections: SyllabusSelections
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  let yOffset = height - 50; // Start from top with margin
  const margin = 50;
  const columnWidth = (width - (margin * 3)) / 2; // Width for 2 columns

  async function addTextBlock(text: string, x: number, y: number, options: any = {}) {
    const {
      font = helvetica,
      size = 11,
      color = rgb(0, 0, 0),
      maxWidth = columnWidth
    } = options;

    const sanitizedText = sanitizeText(text);
    const words = sanitizedText.split(' ');
    let line = '';
    let currentY = y;

    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth) {
        if (line.trim()) {
          page.drawText(line.trim(), {
            x,
            y: currentY,
            size,
            font,
            color
          });
        }
        line = word + ' ';
        currentY -= size * 1.5;

        // Add new page if needed
        if (currentY < margin) {
          const newPage = pdfDoc.addPage([612, 792]);
          currentY = height - margin;
        }
      } else {
        line = testLine;
      }
    }

    if (line.trim()) {
      page.drawText(line.trim(), {
        x,
        y: currentY,
        size,
        font,
        color
      });
    }

    return currentY;
  }

  // Get selected sections
  const selectedSections = Object.keys(selections[syllabuses[0].fileName])
    .filter(section => syllabuses.every(syl => selections[syl.fileName][section]));

  for (const section of selectedSections) {
    // Add section header with styling
    page.drawRectangle({
      x: margin,
      y: yOffset - 30,
      width: width - (margin * 2),
      height: 30,
      color: rgb(0.9, 0.9, 0.9)
    });

    // Add section header
    yOffset = await addTextBlock(
      section.toUpperCase(),
      margin,
      yOffset,
      { font: helveticaBold, size: 14 }
    );
    yOffset -= 20;

    // Add grid lines and proper spacing
    const columnWidth = (width - (margin * 2)) / syllabuses.length;
    const tableHeight = 200; // Define a fixed height for the table section
    
    // Draw vertical lines
    for (let i = 0; i <= syllabuses.length; i++) {
      const x = margin + (i * columnWidth);
      page.drawLine({
        start: { x, y: yOffset },
        end: { x, y: yOffset - tableHeight },
        color: rgb(0.8, 0.8, 0.8)
      });
    }

    // Add content for each syllabus
    for (let i = 0; i < syllabuses.length; i++) {
      const syllabus = syllabuses[i];
      const xPosition = margin + (i * (columnWidth + margin));
      let columnYOffset = yOffset;

      // Add course title
      const courseTitle = syllabus.parsed.courseInfo?.title || 'Untitled Course';
      columnYOffset = await addTextBlock(
        courseTitle,
        xPosition,
        columnYOffset,
        { font: helveticaBold, size: 12 }
      );
      columnYOffset -= 15;

      // Format section content
      let content = '';
      const sectionData = syllabus.parsed[section];
      
      if (sectionData) {
        content = formatSectionContent(sectionData, section);
      }

      // Add the formatted content
      columnYOffset = await addTextBlock(content, xPosition, columnYOffset);
      yOffset = Math.min(yOffset, columnYOffset);
    }

    yOffset -= 40;

    // Add new page if needed
    if (yOffset < margin) {
      const newPage = pdfDoc.addPage([612, 792]);
      yOffset = height - margin;
    }
  }

  return pdfDoc.save();
}

function formatGradeDistribution(data: any): string {
  let text = 'Grade Weights:\n';
  if (Array.isArray(data.weights)) {
    data.weights.forEach((w: any) => {
      text += `${w.category}: ${w.percentage}%\n`;
    });
  }
  
  text += '\nGrade Scale:\n';
  if (Array.isArray(data.scale)) {
    data.scale.forEach((s: any) => {
      text += `${s.grade}: ${s.minimum}%+\n`;
    });
  }
  return text;
}

function formatPolicies(data: any): string {
  let text = '';
  if (data.attendance) text += `Attendance: ${data.attendance}\n\n`;
  if (data.lateWork) text += `Late Work: ${data.lateWork}\n\n`;
  if (data.examFormat) text += `Exam Format: ${data.examFormat}\n\n`;
  if (Array.isArray(data.other)) {
    data.other.forEach((p: any) => {
      text += `${p.title}:\n${p.content}\n\n`;
    });
  }
  return text;
}

function formatInstructorInfo(data: any): string {
  let text = 'Instructors:\n';
  if (Array.isArray(data.instructors)) {
    data.instructors.forEach((i: any) => {
      text += `${i.name}${i.email ? ` (${i.email})` : ''}\n`;
      if (i.office) text += `Office: ${i.office}\n`;
      if (i.officeHours) text += `Hours: ${i.officeHours}\n`;
      text += '\n';
    });
  }
  
  if (Array.isArray(data.tas) && data.tas.length > 0) {
    text += 'Teaching Assistants:\n';
    data.tas.forEach((ta: any) => {
      text += `${ta.name}${ta.email ? ` (${ta.email})` : ''}\n`;
      if (ta.officeHours) text += `Hours: ${ta.officeHours}\n`;
      text += '\n';
    });
  }
  return text;
}

function formatMaterials(data: string[]): string {
  if (!Array.isArray(data)) return 'No materials listed';
  return data.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function formatSchedule(data: any): string {
  if (!data?.entries || !Array.isArray(data.entries)) {
    return 'No schedule available';
  }

  return data.entries.map(entry => {
    const parts = [];
    if (entry.week) parts.push(`Week ${entry.week}`);
    if (entry.date) parts.push(entry.date);
    parts.push(`\nTopic: ${entry.topic}`);
    if (entry.assignments) parts.push(`\nAssignments: ${entry.assignments}`);
    return parts.join(' ') + '\n';
  }).join('\n');
} 