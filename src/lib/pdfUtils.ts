import { PDFDocument } from 'pdf-lib';

export async function combinePDFs(files: File[]): Promise<Uint8Array> {
  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();
  
  // For each PDF file
  for (const file of files) {
    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Load the PDF
    const pdf = await PDFDocument.load(fileBuffer);
    
    // Copy all pages
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    
    // Add each page to the new document
    pages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  
  // Save and return the merged PDF
  return await mergedPdf.save();
}
