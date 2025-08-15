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

    // 1) Build a real DOM node so jsPDF can paginate using CSS page-breaks
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width at 96 DPI (approx)
    container.style.padding = '24px';
    container.style.background = '#ffffff';
    container.style.fontFamily = 'Helvetica, Arial, sans-serif';
    container.style.color = '#111827';
    
    // Helper functions for template string
    const escapeHTML = (s: string): string => {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const splitIntoParagraphs = (s: string): string[] => {
      // Split on double newlines or markdown-style headings to keep paragraphs compact.
      return s
        .split(/\n\s*\n|(?=^#{1,6}\s)/gm)
        .map((t) => t.trim())
        .filter(Boolean);
    };

    container.innerHTML = `
      <style>
        .h1 { font-size: 28px; line-height: 1.2; margin: 0 0 8px 0; font-weight: 700; }
        .h2 { font-size: 20px; line-height: 1.3; margin: 0 0 6px 0; font-weight: 600; }
        .muted { color: #6b7280; font-size: 12px; }
        .card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .section { margin: 18px 0 0 0; }
        .avoid-break { page-break-inside: avoid; break-inside: avoid; }
        .page-break { page-break-before: always; break-before: page; }
        .break-after { page-break-after: always; break-after: page; }
        .kv { display:flex; justify-content:space-between; font-size:12px; padding:6px 8px; border-bottom:1px solid #e5e7eb; }
        .kv:last-child { border-bottom: 0; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        /* Make paragraphs compact to reduce page count, keep readable line-height */
        p { font-size: 12px; line-height: 1.45; margin: 0 0 8px 0; }
        ul { margin: 8px 0; padding-left: 18px; }
        li { margin: 4px 0; }
      </style>

      <div class="section avoid-break">
        <div class="h1">AI Readiness Assessment Report</div>
        <div class="h2">${company || 'Your Company'}</div>
        <div class="muted">Generated on ${new Date().toLocaleDateString()}</div>
      </div>

      <div class="section card avoid-break">
        <div class="h2" style="margin-bottom: 8px;">Overall Score</div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <div style="font-size:40px; font-weight:700; color:#2563eb;">${score}</div>
          <div style="font-size:14px; color:#374151;">out of ${maxScore} points</div>
        </div>
        <div style="font-size:18px; color:#059669; font-weight:700; margin-top:6px;">${tier}</div>
      </div>

      <div class="section card avoid-break">
        <div class="h2">Score Breakdown by Section</div>
        ${Object.entries(breakdown)
          .map(
            ([k, v]) =>
              `<div class="kv"><span>${getSectionName(k)}</span><span class="mono">${v}/${getMaxScore(k)}</span></div>`
          )
          .join('')}
      </div>

      <div class="section page-break">
        <div class="h2" id="exec-summary">Executive Summary</div>
        ${splitIntoParagraphs(aiReport)
          .map((para) => `<p class="avoid-break">${escapeHTML(para)}</p>`)
          .join('')}
      </div>
    `;

    document.body.appendChild(container);

    // 2) Use jsPDF.html for native pagination + CSS page-break rules
    //    Keep unit in "pt" and format "a4" for reliable sizing.
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      compress: true, // enable stream compression
    });

    await doc.html(container, {
      // Fit our 794px content width to PDF printable width (~ 595pt - margins)
      // Let jsPDF compute scale automatically by setting html2canvas width/height via windowWidth.
      html2canvas: {
        scale: 1.2, // balanced quality vs size (lower than default 2)
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      },
      margin: [36, 36, 40, 36], // 0.5in margins
      autoPaging: 'text', // try to avoid cutting text
      // pagebreak: { mode: ['css', 'legacy'] }, // honor our CSS page-breaks
      callback: (d) => {
        d.setProperties({
          title: `AI-Readiness-Report-${company || 'Your Company'}`,
          subject: 'AI Readiness Assessment',
          author: 'Lean Solutions Group',
        });
        d.save(`AI-Readiness-Report-${(company || 'Your Company').replace(/\s+/g, '-')}.pdf`);
      },
      windowWidth: 794, // match container width
    });

    // 3) Cleanup
    document.body.removeChild(container);
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
