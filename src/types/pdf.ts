export interface PDFFile {
  file: File;
  name: string;
  size: number;
  order: number;
}

export interface CourseInfo {
  title: string;
  description: string;
  courseCode?: string;
}

export interface InstructorInfo {
  instructors: Array<{
    name: string;
    email?: string;
    office?: string;
    officeHours?: string;
  }>;
  tas: Array<{
    name: string;
    email?: string;
    officeHours?: string;
  }>;
}

export interface GradeDistribution {
  weights: Array<{
    category: string;
    percentage: number;
  }>;
  scale: Array<{
    grade: string;
    minimum: number;
  }>;
}

export interface CoursePolicies {
  attendance?: string;
  lateWork?: string;
  assignmentDrops?: string;
  examFormat?: string;
  homeworkFormat?: string;
  other: Array<{
    title: string;
    content: string;
  }>;
}

export interface CourseSchedule {
  entries: Array<{
    week?: number;
    date?: string;
    topic: string;
    assignments?: string;
  }>;
}

export interface ParsedSyllabus {
  courseInfo: CourseInfo;
  instructorInfo: InstructorInfo;
  materials?: string[];
  gradeDistribution: GradeDistribution;
  policies: CoursePolicies;
  schedule?: CourseSchedule;
  rawContent: string;
  pageRanges: {
    [key: string]: { start: number; end: number };
  };
}

export interface ProcessedPDF {
  fileName: string;
  size: number;
  pageCount: number;
}

export type SupportedFileType = 'pdf' | 'docx' | 'txt';

export interface UploadedFile {
  file: File;
  parsed: ParsedSyllabus | null;
  error: string | null;
}

export type SyllabusSection = 
  | 'courseInfo'
  | 'instructorInfo'
  | 'materials'
  | 'gradeDistribution'
  | 'policies'
  | 'schedule'
  | 'pageRanges';

export interface CommonSections {
  sections: SyllabusSection[];
  fileNames: string[];
}

export interface SyllabusSelections {
  [fileName: string]: {
    [section: string]: boolean;
  };
}
