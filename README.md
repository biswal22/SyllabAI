# SyllabAI 📚

SyllabAI is a web application that helps students combine and compare syllabuses from multiple courses into a single, organized view. It automatically extracts key information from PDF syllabuses and generates a unified calendar view of all course schedules.

<!-- ![SyllabAI Demo](./docs/demo.gif) -->

## Features 🌟

- **PDF Syllabus Upload**: Upload multiple course syllabuses in PDF, DOCX, or TXT format
- **Intelligent Parsing**: Automatically extracts key information from syllabuses:
  - Course Information
  - Instructor Details
  - Grading Policies
  - Course Schedule
  - And more...
- **Interactive Calendar**: View all course schedules in a unified calendar
  - Color-coded events by course
  - Highlighted exam days
  - Month-by-month view
- **Comparison View**: Compare specific sections across different syllabuses
- **Export Functionality**: Export the combined view as a PDF

## Screenshots 📸

<!-- Screenshots will be added once the application is complete -->

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies: `npm install`
3. Start the backend server in the backend directory: `cd backend && python app.py`
4. Start the development server: `npm run dev`

### Usage

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack 💻

- **Frontend**: React with Next.js
- **Styling**: Tailwind CSS
- **PDF Processing**: pdf.js
- **Calendar**: Custom implementation with date-fns
- **PDF Export**: html2canvas & jsPDF

## Project Structure 📁

