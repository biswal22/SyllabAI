import { ParsedSyllabus } from '../types/pdf';

// This file now mainly serves as a bridge between the backend response
// and our frontend types. We can add validation here if needed.
export async function parseSyllabus(file: File): Promise<ParsedSyllabus> {
  const { extractText } = await import('./textExtractor');
  return extractText(file);
}

// Optional: Add validation function
export function validateParsedSyllabus(data: any): data is ParsedSyllabus {
  // Add validation logic if needed
  return true;
}