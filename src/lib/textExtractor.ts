import { SupportedFileType, ParsedSyllabus } from '../types/pdf';

// Prefer NEXT_PUBLIC_ variables for client-side usage
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function extractText(file: File): Promise<ParsedSyllabus> {
  try {
    console.log('Starting text extraction process');
    console.log('Using backend URL:', BACKEND_URL);
    console.log('File being processed:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('file', file);

    console.log('Making fetch request to backend');
    const response = await fetch(`${BACKEND_URL}/extract-text`, {
      method: 'POST',
      body: formData,
    });

    console.log('Received response with status:', response.status);

    // Handle rate limit errors (HTTP 429)
    if (response.status === 429) {
      // Just throw an error without parsing the response
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!response.ok) {
      // Try to get detailed error information
      let errorMessage = 'Failed to extract text from file';
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e2) {
          // If all else fails, use the status
          errorMessage = `Backend error: ${response.status} ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Successfully parsed response JSON');
    
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