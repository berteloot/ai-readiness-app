// PDFGenerator.tsx
// Radically different approach: HTML/CSS layout + html2canvas for perfect positioning
import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type ScoreItem = {
  key: string;           // e.g., "s1"
  label: string;         // e.g., "Data Infrastructure"
  score: number;         // e.g., 6
  max: number;           // e.g., 10
  note?: string;         // optional short note for the row
};

export type ReportData = {
  company?: string;
  dateISO?: string;      // if omitted, uses today's date
  score: number;         // overall score
  maxScore: number;      // overall max
  summary: string;       // the AI-produced "Executive Summary" text
  items: ScoreItem[];    // breakdown rows
  orderedKeys?: string[]; // optional: enforce row order by keys
};

/**
 * Generate the AI Readiness PDF using HTML/CSS layout for perfect positioning
 */
export function generateAIReadinessPDF(data: ReportData, filename = 'AI-Readiness-Report.pdf') {
  // Validate input data
  if (typeof window === 'undefined') {
    throw new Error('PDF generation must run in browser environment');
  }
  
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided to PDF generator');
  }
  
  if (typeof data.score !== 'number' || typeof data.maxScore !== 'number') {
    throw new Error('Score and maxScore must be numbers');
  }
  
  if (!Array.isArray(data.items)) {
    throw new Error('Items must be an array');
  }
  
  if (typeof data.summary !== 'string') {
    throw new Error('Summary must be a string');
  }

  return new Promise<void>((resolve, reject) => {
    try {
      // Create a temporary container for the report
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '210mm'; // A4 width
      container.style.height = '297mm'; // A4 height
      container.style.backgroundColor = 'white';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.fontSize = '12px';
      container.style.lineHeight = '1.4';
      container.style.color = '#1f2937';
      container.style.overflow = 'hidden';
      
      // Generate the HTML content
      container.innerHTML = generateReportHTML(data);
      
      // Add to DOM temporarily
      document.body.appendChild(container);
      
      // Convert to canvas with high quality
      html2canvas(container, {
        scale: 2, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has proper styling
          const clonedContainer = clonedDoc.querySelector('[data-report-container]') as HTMLElement;
          if (clonedContainer) {
            clonedContainer.style.transform = 'none';
            clonedContainer.style.position = 'relative';
          }
        }
      }).then(canvas => {
        try {
          // Remove temporary container
          document.body.removeChild(container);
          
          // Convert canvas to PDF
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          // Calculate dimensions to fit A4
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          let heightLeft = imgHeight;
          let position = 0;
          
          // Add first page
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          // Save the PDF
          pdf.save(filename);
          resolve();
        } catch (error) {
          reject(error);
        }
      }).catch(error => {
        document.body.removeChild(container);
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate the HTML content for the report with perfect CSS layout
 */
function generateReportHTML(data: ReportData): string {
  const date = data.dateISO ? new Date(data.dateISO) : new Date();
  const dateStr = date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Enforce row order if provided
  const keyOrder = data.orderedKeys?.length
    ? data.orderedKeys.filter(k => data.items.some(i => i.key === k))
    : data.items.map(i => i.key);
  
  const items = keyOrder.map(k => data.items.find(i => i.key === k)!).filter(Boolean);
  
  // Sanitize AI summary
  const cleanSummary = sanitizeAiReport(data.summary, data.score, data.maxScore);
  
  return `
    <div data-report-container style="
      width: 210mm;
      min-height: 297mm;
      background: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1f2937;
      line-height: 1.6;
      overflow: hidden;
    ">
      <!-- Header Section -->
      <header style="
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
        padding: 40px 30px 30px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(50%, -50%);
        "></div>
        
        <h1 style="
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 10px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">AI Readiness Assessment Report</h1>
        
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 30px;
        ">
          <div>
            <h2 style="
              font-size: 24px;
              font-weight: 600;
              margin: 0;
              opacity: 0.9;
            ">${data.company || 'Your Company'}</h2>
            <p style="
              font-size: 16px;
              margin: 5px 0 0 0;
              opacity: 0.8;
            ">${dateStr}</p>
          </div>
          
          <div style="
            background: rgba(255,255,255,0.15);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(10px);
          ">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Overall Score</div>
            <div style="
              font-size: 36px;
              font-weight: 800;
              line-height: 1;
            ">${data.score}/${data.maxScore}</div>
            <div style="
              font-size: 12px;
              opacity: 0.8;
              margin-top: 5px;
            ">${Math.round((data.score / data.maxScore) * 100)}%</div>
          </div>
        </div>
      </header>

      <!-- Executive Summary Section -->
      <section style="padding: 40px 30px 30px;">
        <div style="
          background: #f8fafc;
          border-left: 4px solid #3b82f6;
          padding: 25px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 30px;
        ">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #1e40af;
            margin: 0 0 20px 0;
          ">Executive Summary</h2>
          <div style="
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
            white-space: pre-wrap;
          ">${cleanSummary}</div>
        </div>
      </section>

      <!-- Score Breakdown Section -->
      <section style="padding: 0 30px 40px;">
        <h2 style="
          font-size: 20px;
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        ">Detailed Assessment Scores</h2>
        
        <div style="
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <!-- Table Header -->
          <div style="
            background: #f9fafb;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: #374151;
          ">
            <span style="flex: 1;">Assessment Area</span>
            <span style="
              background: #3b82f6;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              min-width: 80px;
              text-align: center;
            ">Score</span>
          </div>
          
          <!-- Table Rows -->
          ${items.map((item, index) => `
            <div style="
              padding: 20px;
              border-bottom: ${index < items.length - 1 ? '1px solid #f3f4f6' : 'none'};
              display: flex;
              justify-content: space-between;
              align-items: center;
              transition: background-color 0.2s;
            ">
              <div style="flex: 1;">
                <div style="
                  font-weight: 600;
                  color: #1f2937;
                  margin-bottom: 5px;
                ">${item.label}</div>
                ${item.note ? `<div style="
                  font-size: 13px;
                  color: #6b7280;
                  font-style: italic;
                ">${item.note}</div>` : ''}
              </div>
              <div style="
                background: ${getScoreColor(item.score, item.max)};
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
                min-width: 80px;
                text-align: center;
              ">${item.score}/${item.max}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer style="
        background: #f8fafc;
        border-top: 1px solid #e5e7eb;
        padding: 25px 30px;
        text-align: center;
        color: #6b7280;
        font-size: 12px;
      ">
        <div style="margin-bottom: 10px;">
          <strong style="color: #374151;">Generated by Lean Solutions Group</strong>
        </div>
        <div>AI Readiness Assessment Tool • Professional Business Intelligence</div>
        <div style="margin-top: 10px; font-size: 11px; opacity: 0.8;">
          This report provides a comprehensive analysis of your organization's AI readiness across key dimensions.
        </div>
      </footer>
    </div>
  `;
}

/**
 * Get color based on score percentage
 */
function getScoreColor(score: number, max: number): string {
  const percentage = score / max;
  if (percentage >= 0.8) return '#059669'; // green-600
  if (percentage >= 0.6) return '#d97706'; // amber-600
  if (percentage >= 0.4) return '#dc2626'; // red-600
  return '#7c2d12'; // red-800
}

/**
 * Sanitize AI report text
 */
function sanitizeAiReport(txt: string, score: number, maxScore: number): string {
  let out = txt || '';
  out = out.replace(/^AI Readiness Assessment Report\s*\n*/i, '');
  out = out.replace(/^Executive Summary\s*\n*/i, '');
  out = out.replace(/(\bOverall AI Readiness Score:\s*)(\d+)\s*(?:of|\/)\s*\d+/i, `$1${score} of ${maxScore}`);
  out = out.replace(/(\bNumeric Score:\s*)(\d+)\b[^\n]*/i, `$1${score}`);
  return out.trim();
}

/**
 * React component that renders the report preview and handles PDF generation
 */
export const PDFGenerator: React.FC<{ data: ReportData; filename?: string }> = ({
  data,
  filename = 'AI-Readiness-Report.pdf'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await generateAIReadinessPDF(data, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* PDF Preview */}
      <div 
        ref={containerRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}
      >
        <div dangerouslySetInnerHTML={{ __html: generateReportHTML(data) }} />
      </div>
      
      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="
            bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white font-semibold py-3 px-8 rounded-lg
            transition-colors duration-200
            flex items-center justify-center mx-auto
          "
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download AI Readiness Report (PDF)
            </>
          )}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Legacy button component for backward compatibility
 */
export const PDFButton: React.FC<{ data: ReportData; filename?: string; className?: string }> = ({
  data,
  filename = 'AI-Readiness-Report.pdf',
  className,
}) => {
  const handleClick = () => generateAIReadinessPDF(data, filename);
  return (
    <button onClick={handleClick} className={className}>
      Download AI Readiness Report (PDF)
    </button>
  );
};
