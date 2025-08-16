import { NextRequest, NextResponse } from 'next/server';
import { scoreAnswers, type Answers, type ScoreResult } from '@/lib/scoring';
import { buildReportPrompt } from '@/lib/prompt';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    const requiredEnvVars = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      return NextResponse.json(
        { 
          error: 'Server configuration incomplete. Please contact support.',
          details: `Missing: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, company, consent, ...answers } = body;

    // Validate required fields
    if (!email || !company || !consent) {
      return NextResponse.json(
        { error: 'Email, company name, and consent are required' },
        { status: 400 }
      );
    }



    // Calculate score
    const result = scoreAnswers(answers as Answers);

    // Generate AI report using OpenAI
    let aiReport = '';
    try {
      const prompt = buildReportPrompt(result, answers as Answers);
      
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert operations and CX transformation consultant. Generate professional, actionable reports for AI readiness assessments.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        aiReport = openaiData.choices[0]?.message?.content || 'Unable to generate AI report';
      } else {
        console.error('OpenAI API error:', await openaiResponse.text());
        aiReport = 'AI report generation temporarily unavailable';
      }
    } catch (openaiError) {
      console.error('OpenAI integration error:', openaiError);
      aiReport = 'AI report generation temporarily unavailable';
    }

    // Send email via SendGrid
    let emailSent = false;
    try {
      console.log('Attempting to send email via SendGrid...');
      console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY ? 'Present' : 'Missing');
      console.log('From Email:', process.env.SENDGRID_FROM_EMAIL || 'reports@yourdomain.com');
      console.log('To Email:', email);
      
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: email, name: `${company} Team` }],
              subject: `Lean Solutions Group AI Readiness Report - ${company}`,
            },
          ],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'reports@yourdomain.com',
            name: process.env.SENDGRID_FROM_NAME || 'AI Readiness Reports',
          },
          content: [
            {
              type: 'text/plain',
              value: generateEmailText(result, aiReport, answers as Answers, company),
            },
            {
              type: 'text/html',
              value: generateEmailHTML(result, aiReport, answers as Answers, company),
            },
          ],
        }),
      });

      console.log('SendGrid Response Status:', emailResponse.status);
      console.log('SendGrid Response Headers:', Object.fromEntries(emailResponse.headers.entries()));

      if (emailResponse.ok) {
        emailSent = true;
        console.log('Email sent successfully to:', email);
      } else {
        const errorText = await emailResponse.text();
        console.error('SendGrid API error response:', errorText);
        console.error('SendGrid API error status:', emailResponse.status);
      }
    } catch (emailError) {
      console.error('SendGrid integration error:', emailError);
    }

    // Store submission in PostgreSQL database
    try {
      const submission = await prisma.submission.create({
        data: {
          user: {
            connectOrCreate: {
              where: { email },
              create: { email }
            }
          },
          company,
          answers,
          score: result.score,
          tier: mapTier(result.tier),
          aiReport,
          painPoints: extractPainPoints(answers as Answers),
          emailedAt: emailSent ? new Date() : null,
          emailStatus: emailSent ? 'SENT' : 'FAILED'
        }
      });
      
      console.log('Submission saved to database:', submission.id);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if storage fails
    }

    // Return the calculated score, AI report, and email status
    return NextResponse.json({
      success: true,
      result,
      aiReport,
      emailSent,
      message: emailSent 
        ? 'Assessment completed successfully! AI report generated and sent to your email.'
        : 'Assessment completed successfully! AI report generated. Email delivery issue - please contact support.',
      email: email
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Convert markdown to HTML for email display
function convertMarkdownToHTML(markdown: string): string {
  return markdown
    // Convert headers
    .replace(/^### (.*$)/gim, '<h3 style="margin: 20px 0 10px 0; color: #495057; font-size: 18px; font-weight: 600;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin: 25px 0 15px 0; color: #495057; font-size: 20px; font-weight: 600;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="margin: 30px 0 20px 0; color: #495057; font-size: 24px; font-weight: 700;">$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #495057;">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #495057;">$1</em>')
    // Convert line breaks
    .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
    // Convert single line breaks
    .replace(/\n/g, '<br>')
    // Clean up citations to only show organization names, not full URLs
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep text
    .replace(/https?:\/\/[^\s]+/g, '') // Remove any remaining URLs
    // Wrap in paragraphs
    .replace(/^(.*)$/gm, '<p style="margin: 10px 0;">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p style="margin: 10px 0;"><\/p>/g, '')
    // Remove extra paragraph wrappers
    .replace(/<p style="margin: 10px 0;"><p style="margin: 10px 0;">/g, '<p style="margin: 10px 0;">')
    .replace(/<\/p><\/p>/g, '</p>');
}

function mapTier(tier: string): 'NOT_READY' | 'GETTING_STARTED' | 'AI_ENHANCED' {
  switch (tier) {
    case 'Not Ready Yet':
      return 'NOT_READY';
    case 'Getting Started':
      return 'GETTING_STARTED';
    case 'AI-Enhanced':
      return 'AI_ENHANCED';
    default:
      return 'NOT_READY';
  }
}

function extractPainPoints(answers: Answers): string[] {
  const painPoints: string[] = [];
  
  // q1: string[] - Current Automation Level (2 points each, max 8)
  const q1Score = answers.q1.reduce((sum: number, val: string) => sum + parseInt(val), 0);
  if (q1Score < 4) painPoints.push('Technology Infrastructure');
  
  // q2: string - Data Infrastructure Maturity (0-4 points)
  if (parseInt(answers.q2) < 2) painPoints.push('Data Foundation');
  
  // q3: string - Workforce AI Adoption Readiness (0-4 points)
  if (parseInt(answers.q3) < 2) painPoints.push('Human Capital');
  
  // q4: string - Scalability of CX Operations (0-4 points)
  if (parseInt(answers.q4) < 2) painPoints.push('Strategic Planning');
  
  // q5: string[] - KPI Tracking Sophistication (1 point each, max 5)
  const q5Score = answers.q5.reduce((sum: number, val: string) => sum + parseInt(val), 0);
  if (q5Score < 3) painPoints.push('Measurement & Analytics');
  
  // q6: string[] - Security & Compliance (2 points each, max 6)
  const q6Score = answers.q6.reduce((sum: number, val: string) => sum + parseInt(val), 0);
  if (q6Score < 3) painPoints.push('Risk Management');
  
  // q7: string - Budget & Executive Buy-In (0-4 points)
  if (parseInt(answers.q7) < 2) painPoints.push('Organizational Support');
  
  return painPoints;
}

function generateEmailHTML(result: ScoreResult, aiReport: string, answers: Answers, company: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lean Solutions Group AI Readiness Report</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .company-name { 
          font-size: 20px; 
          font-weight: 600; 
          color: #495057; 
          margin-bottom: 20px;
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .score-card { 
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #dee2e6; 
          border-radius: 12px; 
          padding: 30px; 
          margin: 25px 0; 
          text-align: center; 
        }
        .score { 
          font-size: 56px; 
          font-weight: 800; 
          color: #007bff; 
          margin-bottom: 10px;
          line-height: 1;
        }
        .score-subtitle {
          font-size: 18px;
          color: #6c757d;
          margin-bottom: 15px;
        }
        .tier { 
          font-size: 28px; 
          color: #28a745; 
          font-weight: 700;
          margin: 0;
        }
        .breakdown { 
          background: white; 
          border: 1px solid #dee2e6; 
          border-radius: 12px; 
          padding: 25px; 
          margin: 25px 0; 
        }
        .breakdown h3 {
          margin: 0 0 20px 0;
          color: #495057;
          font-size: 20px;
          font-weight: 600;
        }
        .section { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin: 12px 0; 
          padding: 12px 0; 
          border-bottom: 1px solid #e9ecef; 
        }
        .section:last-child {
          border-bottom: none;
        }
        .section-name {
          font-weight: 500;
          color: #495057;
        }
        .section-score {
          font-weight: 700;
          color: #007bff;
          font-size: 16px;
        }
        .ai-report { 
          background: #f8f9fa; 
          border-left: 4px solid #007bff; 
          padding: 25px; 
          margin: 25px 0; 
          border-radius: 0 8px 8px 0;
        }
        .ai-report h3 {
          margin: 0 0 20px 0;
          color: #495057;
          font-size: 20px;
          font-weight: 600;
        }
        .ai-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #495057;
          white-space: pre-wrap;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding: 25px; 
          color: #6c757d; 
          font-size: 14px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          margin: 8px 0;
        }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .header { padding: 30px 20px; }
          .content { padding: 20px; }
          .score { font-size: 48px; }
          .tier { font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AI Readiness Assessment Report</h1>
          <p>Your personalized analysis and roadmap for AI transformation</p>
        </div>

        <div class="content">
          <div class="company-name">Company: ${company}</div>

          <div class="score-card">
            <div class="score">${result.score}</div>
            <div class="score-subtitle">out of ${result.maxScore} points</div>
            <div class="tier">${result.tier}</div>
          </div>

          <div class="breakdown">
            <h3>Score Breakdown by Section</h3>
            ${Object.keys(result.breakdown).length > 0 ? 
              Object.entries(result.breakdown).map(([key, score]) => `
                <div class="section">
                  <span class="section-name">${getSectionName(key)}</span>
                  <span class="section-score">${score}/${getMaxScore(key)}</span>
                </div>
              `).join('') : 
              '<div class="section"><span class="section-name">No breakdown data available</span></div>'
            }
          </div>

          <div class="ai-report">
            <h3>AI-Generated Analysis & Recommendations</h3>
            <div class="ai-content">
              ${convertMarkdownToHTML(aiReport)}
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Report generated on ${new Date().toLocaleDateString()}</strong></p>
          <p>For questions or support, please contact Lean Solutions Group</p>
          <p>This assessment was powered by advanced AI analysis</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(result: ScoreResult, aiReport: string, answers: Answers, company: string): string {
  // Convert markdown to plain text for email
  const plainTextReport = aiReport
    .replace(/^#+\s*/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\n\n/g, '\n\n') // Keep paragraph breaks
    // Clean up citations to only show organization names, not full URLs
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep text
    .replace(/https?:\/\/[^\s]+/g, '') // Remove any remaining URLs
    .trim();

  return `
LEAN SOLUTIONS GROUP - AI READINESS ASSESSMENT REPORT
====================================================

Company: ${company}
Assessment Date: ${new Date().toLocaleDateString()}

YOUR RESULTS
-----------
Total Score: ${result.score} out of ${result.maxScore} points
Readiness Tier: ${result.tier}

SCORE BREAKDOWN BY SECTION
-------------------------
${Object.keys(result.breakdown).length > 0 ? 
  Object.entries(result.breakdown).map(([key, score]) => `• ${getSectionName(key)}: ${score}/${getMaxScore(key)} points`).join('\n') : 
  '• No breakdown data available'
}

AI-GENERATED ANALYSIS & RECOMMENDATIONS
======================================
${plainTextReport}

---
This report was generated by Lean Solutions Group's AI-powered assessment tool.
For questions or support, please contact us.

Powered by advanced AI analysis and industry expertise.
  `.trim();
}

function getSectionName(key: string): string {
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
}

function getMaxScore(key: string): number {
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
}
