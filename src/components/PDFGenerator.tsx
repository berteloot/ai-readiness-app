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

      // Page dimensions
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin + 40;

      // Header with gradient-like effect
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 120, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Readiness Assessment Report', pageWidth / 2, 60, { align: 'center' });
      
      // Company name
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.text(company || 'Your Company', pageWidth / 2, 85, { align: 'center' });
      
      // Date
      doc.setFontSize(12);
      doc.setTextColor(200, 210, 255);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, 105, { align: 'center' });

      yPosition = 140;

      // Overall Score Section with enhanced design
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(2);
      doc.roundedRect(margin, yPosition - 25, contentWidth, 100, 8, 8, 'FD');
      
      // Score display with better positioning
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Overall Score', margin + 25, yPosition);
      yPosition += 25;

      // Large score number
      doc.setFontSize(36);
      doc.setTextColor(37, 99, 235);
      doc.text(score.toString(), margin + 25, yPosition);
      
      // Score details
      doc.setFontSize(14);
      doc.setTextColor(107, 114, 128);
      doc.text(`out of ${maxScore} points`, margin + 120, yPosition);
      yPosition += 25;

      // Tier with colored background
      const tierWidth = doc.getTextWidth(tier) + 20;
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(margin + 25, yPosition - 15, tierWidth, 25, 5, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(tier, margin + 25 + (tierWidth / 2), yPosition, { align: 'center' });
      
      yPosition += 50;

      // Score Breakdown Section
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(1);
      doc.roundedRect(margin, yPosition - 25, contentWidth, 140, 8, 8, 'FD');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Score Breakdown by Section', margin + 25, yPosition);
      yPosition += 25;

      // Section header
      doc.setFillColor(248, 250, 252);
      doc.rect(margin + 20, yPosition - 15, contentWidth - 40, 20, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin + 20, yPosition - 15, contentWidth - 40, 20, 'S');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Section', margin + 35, yPosition);
      doc.text('Score', margin + contentWidth - 60, yPosition);
      yPosition += 20;

      // Breakdown items with alternating row colors
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.entries(breakdown).forEach(([key, value], index) => {
        const sectionName = getSectionName(key);
        const maxSectionScore = getMaxScore(key);
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(margin + 20, yPosition - 12, contentWidth - 40, 18, 'F');
        
        doc.setTextColor(31, 41, 55);
        doc.text(sectionName, margin + 35, yPosition);
        
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.text(`${value}/${maxSectionScore}`, margin + contentWidth - 60, yPosition);
        
        yPosition += 18;
      });

      yPosition += 30;

      // Executive Summary with enhanced styling
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(3);
      doc.roundedRect(margin, yPosition - 25, contentWidth, 30, 8, 8, 'FD');
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Executive Summary', margin + 25, yPosition);
      yPosition += 35;

      // AI Report content with improved formatting
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      doc.setLineWidth(0.5);

      const paragraphs = aiReport.split(/\n\s*\n/).filter(p => p.trim());
      
      paragraphs.forEach((paragraph: string) => {
        // Handle markdown-style headers
        if (paragraph.startsWith('#')) {
          const headerLevel = paragraph.match(/^#+/)?.[0].length || 1;
          const headerText = paragraph.replace(/^#+\s*/, '').trim();
          
          if (yPosition + 30 > pageHeight - margin) {
            doc.addPage();
            yPosition = margin + 40;
          }
          
          // Different styling for different header levels
          if (headerLevel === 1) {
            // Main section headers (e.g., "Section 5: KPIs Tracked")
            doc.setFillColor(37, 99, 235);
            doc.roundedRect(margin, yPosition - 15, contentWidth, 25, 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(headerText, margin + 15, yPosition);
            yPosition += 30;
          } else if (headerLevel === 2) {
            // Subsection headers (e.g., "Interpretation", "Industry Benchmark Comparison")
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(margin + 10, yPosition - 12, contentWidth - 20, 20, 3, 3, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(margin + 10, yPosition - 12, contentWidth - 20, 20, 3, 3, 'S');
            doc.setTextColor(31, 41, 55);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(headerText, margin + 20, yPosition);
            yPosition += 25;
          } else {
            // Level 3+ headers
            doc.setTextColor(37, 99, 235);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(headerText, margin + 15, yPosition);
            yPosition += 20;
          }
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(55, 65, 81);
        } else {
          // Handle bold text within paragraphs (e.g., "**Score:** 4")
          if (paragraph.includes('**')) {
            const parts = paragraph.split(/(\*\*.*?\*\*)/);
            let currentX = margin + 15;
            
            parts.forEach((part: string) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                const boldText = part.slice(2, -2);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(37, 99, 235);
                doc.text(boldText, currentX, yPosition);
                currentX += doc.getTextWidth(boldText);
              } else if (part.trim()) {
                // Regular text
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(55, 65, 81);
                doc.text(part, currentX, yPosition);
                currentX += doc.getTextWidth(part);
              }
            });
            yPosition += 16;
          } else {
            // Regular paragraph
            const lines = doc.splitTextToSize(paragraph.trim(), contentWidth - 20);
            
            // Check if we need a new page
            if (yPosition + (lines.length * 14) > pageHeight - margin) {
              doc.addPage();
              yPosition = margin + 40;
            }
            
            lines.forEach((line: string) => {
              doc.text(line, margin + 15, yPosition);
              yPosition += 14;
            });
          }
          
          yPosition += 8; // Space between paragraphs
        }
      });

      // Footer
      const footerY = pageHeight - 40;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text('Generated by Lean Solutions Group', pageWidth / 2, footerY + 15, { align: 'center' });
      doc.text('AI Readiness Assessment Tool', pageWidth / 2, footerY + 28, { align: 'center' });

      // Set document properties
      doc.setProperties({
        title: `AI-Readiness-Report-${company || 'Your Company'}`,
        subject: 'AI Readiness Assessment',
        author: 'Lean Solutions Group',
        creator: 'AI Readiness Assessment Tool',
        keywords: 'AI, Readiness, Assessment, Digital Transformation',
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
      s5: 'KPIs Tracked',
      s6: 'Security & Compliance',
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
