'use client';

import { generateAIReadinessPDF, ReportData } from '@/components/PDFGenerator';

export default function TestPDFPage() {
  const testData: ReportData = {
    company: 'Test Company',
    dateISO: new Date().toISOString(),
    score: 25,
    maxScore: 35,
    summary: 'This is a test AI analysis report for testing PDF generation functionality.',
    items: [
      {
        key: 's1',
        label: 'Current Tools in Use',
        score: 6,
        max: 8,
        note: 'Current Automation Level'
      },
      {
        key: 's2',
        label: 'Data Maturity',
        score: 3,
        max: 4,
        note: 'Data Infrastructure Maturity'
      },
      {
        key: 's3',
        label: 'Workforce Readiness',
        score: 4,
        max: 4,
        note: 'Workforce AI Adoption Readiness'
      }
    ],
    orderedKeys: ['s1', 's2', 's3']
  };

  const handleTestPDF = () => {
    try {
      console.log('Testing PDF generation with data:', testData);
      generateAIReadinessPDF(testData, 'test-ai-readiness-report.pdf');
      console.log('PDF generation completed successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">PDF Generation Test</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test PDF generation functionality.
        </p>
        <button
          onClick={handleTestPDF}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Test PDF
        </button>
        <div className="mt-4 text-sm text-gray-500">
          Check the browser console for any error messages.
        </div>
      </div>
    </div>
  );
}
