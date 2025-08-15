'use client';

import { jsPDF } from 'jspdf';
import React from 'react';

interface PDFGeneratorProps {
  result: {
    score: number;
    tier: string;
    breakdown: Record<string, number>;
    maxScore: number;
  };
  aiReport: string;
  company: string;
}

export default function PDFGenerator({ result, aiReport, company }: PDFGeneratorProps) {
  const generatePDF = async () => {
    const { score, tier, breakdown, maxScore } = result;

    // Create a temporary container for PDF generation
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '595px'; // A4 width in points
    container.style.padding = '20px';
    container.style.background = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#000000';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.4';
    
    // Helper functions
    const escapeHTML = (s: string): string => {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const splitIntoParagraphs = (s: string): string[] => {
      return s
        .split(/\n\s*\n|(?=^#{1,6}\s)/gm)
        .map((t) => t.trim())
        .filter(Boolean);
    };

    // Build the HTML content without CSS page breaks
    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0; color: #1f2937;">
          AI Readiness Assessment Report
        </h1>
        <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 5px 0; color: #374151;">
          ${company || 'Your Company'}
        </h2>
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          Generated on ${new Date().toLocaleDateString()}
        </p>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 10px 0; color: #1f2937;">
          Overall Score
        </h3>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 32px; font-weight: bold; color: #2563eb;">${score}</span>
          <span style="font-size: 14px; color: #374151;">out of ${maxScore} points</span>
        </div>
        <div style="font-size: 16px; color: #059669; font-weight: 600;">${tier}</div>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 10px 0; color: #1f2937;">
          Score Breakdown by Section
        </h3>
        ${Object.entries(breakdown)
          .map(
            ([k, v]) =>
              `<div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e7eb; font-size: 12px;">
                <span>${getSectionName(k)}</span>
                <span style="font-family: monospace; font-weight: 600;">${v}/${getMaxScore(k)}</span>
              </div>`
          )
          .join('')}
      </div>

      <div style="margin-top: 30px;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 15px 0; color: #1f2937;">
          Executive Summary
        </h3>
        ${splitIntoParagraphs(aiReport)
          .map((para) => `<p style="margin: 0 0 12px 0; text-align: justify;">${escapeHTML(para)}</p>`)
          .join('')}
      </div>
    `;

    document.body.appendChild(container);

    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        compress: true,
      });

      // Use html2canvas with optimized settings
      await doc.html(container, {
        x: 20,
        y: 20,
        width: 555, // A4 width minus margins
        html2canvas: {
          scale: 1,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 595,
          height: container.scrollHeight,
        },
        callback: function(doc) {
          // Set document properties
          doc.setProperties({
            title: `AI-Readiness-Report-${company || 'Your Company'}`,
            subject: 'AI Readiness Assessment',
            author: 'Lean Solutions Group',
          });
          
          // Save the PDF
          doc.save(`AI-Readiness-Report-${(company || 'Your Company').replace(/\s+/g, '-')}.pdf`);
        }
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Cleanup
      document.body.removeChild(container);
    }
  };

  const getSectionName = (key: string): string => {
    const sectionNames: Record<string, string> = {
      s1: 'Technology Infrastructure',
      s2: 'Data Foundation',
      s3: 'Human Capital',
      s4: 'Strategic Planning',
      s5: 'Measurement & Analytics',
      s6: 'Risk Management',
      s7: 'Organizational Support'
    };
    return sectionNames[key] || key;
  };

  const getMaxScore = (key: string): number => {
    const maxScores: Record<string, number> = {
      s1: 8,
      s2: 4,
      s3: 4,
      s4: 4,
      s5: 5,
      s6: 6,
      s7: 4
    };
    return maxScores[key] || 0;
  };

  return (
    <button
      onClick={generatePDF}
      className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Download PDF Report</span>
    </button>
  );
}
