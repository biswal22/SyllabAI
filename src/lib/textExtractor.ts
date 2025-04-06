import { SupportedFileType, ParsedSyllabus } from '../types/pdf';

// Prefer NEXT_PUBLIC_ variables for client-side usage
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function extractText(file: File): Promise<ParsedSyllabus> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Using backend URL:', BACKEND_URL); // For debugging during deployment

    const response = await fetch(`${BACKEND_URL}/extract-text`, {
      method: 'POST',
      body: formData,
    });

    // Handle rate limit errors (HTTP 429)
    if (response.status === 429) {
      // Just throw an error without parsing the response
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!response.ok) {
      throw new Error('Failed to extract text from file');
    }

    const data = await response.json();
    return JSON.parse(data.analyzed);
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
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