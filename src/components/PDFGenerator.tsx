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

    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        compress: true,
      });

      // Set up fonts and colors
      doc.setFont('helvetica');
      doc.setTextColor(0, 0, 0);

      // Page dimensions
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 40;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin + 30;

      // Title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Readiness Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 40;

      // Company name
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(company || 'Your Company', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 30;

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 40;

      // Overall Score Section
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPosition - 20, contentWidth, 80, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, yPosition - 20, contentWidth, 80, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Overall Score', margin + 20, yPosition);
      yPosition += 25;

      // Score display
      doc.setFontSize(28);
      doc.setTextColor(37, 99, 235);
      doc.text(score.toString(), margin + 20, yPosition);
      
      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      doc.text(`out of ${maxScore} points`, margin + 80, yPosition);
      yPosition += 20;

      doc.setFontSize(14);
      doc.setTextColor(5, 150, 105);
      doc.text(tier, margin + 20, yPosition);
      yPosition += 60;

      // Score Breakdown Section
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPosition - 20, contentWidth, 120, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, yPosition - 20, contentWidth, 120, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Score Breakdown by Section', margin + 20, yPosition);
      yPosition += 25;

      // Breakdown items
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.entries(breakdown).forEach(([key, value]) => {
        const sectionName = getSectionName(key);
        const maxSectionScore = getMaxScore(key);
        
        doc.setTextColor(31, 41, 55);
        doc.text(sectionName, margin + 20, yPosition);
        
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.text(`${value}/${maxSectionScore}`, margin + contentWidth - 20, yPosition, { align: 'right' });
        
        yPosition += 15;
      });

      yPosition += 30;

      // Executive Summary
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Executive Summary', margin, yPosition);
      yPosition += 25;

      // AI Report content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const paragraphs = aiReport.split(/\n\s*\n/).filter(p => p.trim());
      
      paragraphs.forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph.trim(), contentWidth - 20);
        
        // Check if we need a new page
        if (yPosition + (lines.length * 12) > pageHeight - margin) {
          doc.addPage();
          yPosition = margin + 30;
        }
        
        lines.forEach((line: string) => {
          doc.text(line, margin + 10, yPosition);
          yPosition += 12;
        });
        
        yPosition += 8; // Space between paragraphs
      });

      // Set document properties
      doc.setProperties({
        title: `AI-Readiness-Report-${company || 'Your Company'}`,
        subject: 'AI Readiness Assessment',
        author: 'Lean Solutions Group',
      });

      // Save the PDF
      doc.save(`AI-Readiness-Report-${(company || 'Your Company').replace(/\s+/g, '-')}.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
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
