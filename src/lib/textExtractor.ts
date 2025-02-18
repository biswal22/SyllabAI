import { UploadedFile, SupportedFileType, ParsedSyllabus } from '../types/pdf';

const BACKEND_URL = 'http://localhost:5000';

export async function extractText(file: File): Promise<ParsedSyllabus> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/extract-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract text from file');
    }

    const data = await response.json();
    return JSON.parse(data.analyzed);
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error.message}`);
  }
}

export function getFileType(filename: string): SupportedFileType {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'txt':
      return 'txt';
    default:
      throw new Error('Unsupported file type');
  }
} 