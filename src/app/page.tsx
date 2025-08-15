'use client';

import { useState } from 'react';
import AssessmentForm from '@/components/AssessmentForm';
import ContactModal from '@/components/ContactModal';
import PDFGenerator from '@/components/PDFGenerator';
import { z } from 'zod';

type FormData = z.infer<typeof import('@/components/AssessmentForm').default extends React.ComponentType<infer P> ? P : never>;

interface ContactData {
  email: string;
  company: string;
  consent: boolean;
}

interface AssessmentResult {
  score: number;
  tier: string;
  message?: string;
  aiReport?: string;
  company?: string;
  breakdown: Record<string, number>;
  maxScore: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState<FormData | null>(null);

  const handleAssessmentComplete = (data: FormData) => {
    setAssessmentData(data);
    setShowContactModal(true);
  };

  const handleContactSubmit = async (contactData: ContactData) => {
    setIsLoading(true);
    setError('');
    setShowContactModal(false);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...assessmentData!, ...contactData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto mobile-optimized relative">
          {/* PDF Download Button - Top Right */}
          <div className="absolute top-0 right-0 z-10">
            <PDFGenerator 
              result={{
                score: result.score,
                tier: result.tier,
                breakdown: result.breakdown || {},
                maxScore: result.maxScore || 29
              }} 
              aiReport={result.aiReport || ''} 
              company={result.company || 'Your Company'} 
            />
          </div>

          {/* Success Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Assessment Complete! 🎉
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI Readiness report has been generated and sent to your email. 
              Check your inbox for detailed insights and actionable recommendations.
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Your Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Score Display */}
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 mb-2 sm:mb-3">
                  {result.score}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2">out of 29</div>
                <div className="text-base sm:text-lg text-gray-600">Total Score</div>
                <div className="mt-3 sm:mt-4 text-sm text-blue-700 font-medium">
                  {result.message || 'Score calculated based on your responses'}
                </div>
              </div>
              
              {/* Tier Display */}
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                  {result.tier}
                </div>
                <div className="text-lg sm:text-xl text-gray-700 mb-2">Readiness Tier</div>
                <div className="text-base sm:text-lg text-gray-600">Your Current Level</div>
                <div className="mt-3 sm:mt-4 text-sm text-green-700 font-medium">
                  {result.tier === 'AI-Enhanced' && 'Ready for advanced AI implementation'}
                  {result.tier === 'Getting Started' && 'Good foundation, ready to begin AI journey'}
                  {result.tier === 'Not Ready Yet' && 'Focus on building foundational capabilities'}
                </div>
              </div>
            </div>

            {/* AI Report Display */}
            {result.aiReport && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl border border-gray-200 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  AI-Generated Analysis & Recommendations
                </h3>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
                  <div className="prose prose-lg max-w-none">
                    {result.aiReport ? (
                      <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                        {result.aiReport.split('\n').map((line, index) => {
                          // Handle markdown-style headers
                          if (line.match(/^#{1,6}\s+/)) {
                            const level = line.match(/^(#{1,6})\s+/)?.[1]?.length || 1;
                            const text = line.replace(/^#{1,6}\s+/, '');
                            return (
                              <div key={index} className={`font-bold text-gray-900 mb-2 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}>
                                {text}
                              </div>
                            );
                          }
                          // Handle bold text
                          if (line.includes('**')) {
                            const parts = line.split(/(\*\*.*?\*\*)/g);
                            return (
                              <div key={index} className="mb-2">
                                {parts.map((part, partIndex) => {
                                  if (part.match(/\*\*.*?\*\*/)) {
                                    return <strong key={partIndex}>{part.replace(/\*\*/g, '')}</strong>;
                                  }
                                  return part;
                                })}
                              </div>
                            );
                          }
                          // Handle italic text
                          if (line.includes('*') && !line.includes('**')) {
                            const parts = line.split(/(\*.*?\*)/g);
                            return (
                              <div key={index} className="mb-2">
                                {parts.map((part, partIndex) => {
                                  if (part.match(/\*.*?\*/)) {
                                    return <em key={partIndex}>{part.replace(/\*/g, '')}</em>;
                                  }
                                  return part;
                                })}
                              </div>
                            );
                          }
                          // Regular line
                          return <div key={index} className="mb-2">{line}</div>;
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">No AI report available</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* What's Next Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Immediate Actions</h4>
                  <ul className="space-y-2 sm:space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2 sm:mr-3">✅</span>
                      Check your email for the detailed report
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2 sm:mr-3">📊</span>
                      Review your readiness breakdown by section
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2 sm:mr-3">🛣️</span>
                      Follow the 30-60-90 day roadmap
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Next Steps</h4>
                  <ul className="space-y-2 sm:space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2 sm:mr-3">🚀</span>
                      Start with the quick wins identified
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2 sm:mr-3">📈</span>
                      Track progress with the suggested KPIs
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2 sm:mr-3">💡</span>
                      Share insights with your team
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={() => {
                setResult(null);
                setError('');
              }}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto touch-friendly"
            >
              Take Another Assessment
            </button>
            <div className="text-sm text-gray-500">
              Perfect for comparing different departments or tracking progress over time
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-100">
      {/* Hero Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto mobile-optimized py-16 sm:py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 accent-gradient rounded-full mb-6 sm:mb-8 shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              AI Readiness Assessment
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
              Evaluate your organization&apos;s readiness for AI transformation with our comprehensive assessment. 
              Get a personalized report with actionable insights and a roadmap for success.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
              <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 accent-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Comprehensive Evaluation</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">9 key areas covering technology, data, workforce, and strategy</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 accent-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Instant Delivery</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Detailed report sent directly to your email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment */}
      <div className="py-12 sm:py-16">
        {error && error !== '' && (
          <div className="max-w-4xl mx-auto mobile-optimized mb-6 sm:mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-red-800">Submission Error</h3>
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base text-red-700">{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AssessmentForm onSubmit={handleAssessmentComplete} isLoading={isLoading} />
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto mobile-optimized py-8 sm:py-12">
          <div className="text-center">
            <div className="text-gray-500 mb-3 sm:mb-4">
              <p className="text-base sm:text-lg">AI Readiness Assessment Tool</p>
              <p className="text-xs sm:text-sm">Powered by Lean Solutions Group and Nytro Marketing</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && assessmentData && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
