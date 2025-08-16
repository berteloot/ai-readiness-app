'use client';

import { PDFGenerator, ReportData } from '@/components/PDFGenerator';

export default function TestPDFPage() {
  // Sample data for testing
  const sampleData: ReportData = {
    company: 'Acme Corporation',
    dateISO: new Date().toISOString(),
    score: 7,
    maxScore: 10,
    summary: `Based on our comprehensive assessment, Acme Corporation demonstrates a **moderate to high level of AI readiness** with an overall score of 7 out of 10.

Your organization shows particular strength in data infrastructure and leadership commitment, which provides a solid foundation for AI initiatives. However, there are opportunities for improvement in technical skills development and change management processes.

**Key Recommendations:**
1. Invest in AI training programs for technical teams
2. Establish clear AI governance frameworks
3. Develop pilot projects to build organizational confidence
4. Strengthen data quality and integration processes

With focused effort in these areas, Acme Corporation could achieve a high AI readiness score within 6-12 months.`,
    items: [
      {
        key: 's1',
        label: 'Data Infrastructure & Quality',
        score: 8,
        max: 10,
        note: 'Strong data foundation with room for integration improvements'
      },
      {
        key: 's2',
        label: 'Technical Skills & Expertise',
        score: 6,
        max: 10,
        note: 'Some AI expertise exists but needs broader distribution'
      },
      {
        key: 's3',
        label: 'Leadership & Strategy',
        score: 9,
        max: 10,
        note: 'Excellent executive support and clear strategic direction'
      },
      {
        key: 's4',
        label: 'Change Management',
        score: 5,
        max: 10,
        note: 'Opportunity to improve organizational change processes'
      },
      {
        key: 's5',
        label: 'Technology Stack',
        score: 7,
        max: 10,
        note: 'Modern infrastructure with some legacy system challenges'
      }
    ],
    orderedKeys: ['s1', 's2', 's3', 's4', 's5']
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Readiness Report Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the new HTML/CSS-based PDF generator that creates perfectly laid out reports 
            with professional styling, proper margins, and company branding.
          </p>
        </div>

        {/* PDF Generator Component */}
        <PDFGenerator 
          data={sampleData} 
          filename="Acme-Corporation-AI-Readiness-Report.pdf"
        />

        {/* Features Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Layout</h3>
            <p className="text-gray-600">
              CSS-based layout ensures perfect positioning, margins, and typography without manual calculations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Design</h3>
            <p className="text-gray-600">
              Modern, responsive design with gradients, shadows, and professional color schemes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Customization</h3>
            <p className="text-gray-600">
              Simple CSS modifications for company branding, colors, and layout adjustments.
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Generate HTML content with perfect CSS layout</li>
                <li>Use html2canvas to convert to high-quality image</li>
                <li>Convert image to PDF with jsPDF</li>
                <li>Handle multi-page documents automatically</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>No manual positioning calculations</li>
                <li>Automatic text wrapping and spacing</li>
                <li>Professional typography and spacing</li>
                <li>Easy to maintain and modify</li>
                <li>Responsive design principles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
