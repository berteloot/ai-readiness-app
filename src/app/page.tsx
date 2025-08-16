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
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState<FormData | null>(null);

  const handleAssessmentComplete = (data: FormData) => {
    setAssessmentData(data);
    setShowContactModal(true);
  };

  const handleContactSubmit = async (contactData: ContactData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...assessmentData!, ...contactData }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Submission failed');
      }

      // Extract the result from the API response
      const { result, aiReport } = responseData;
      
      setResult({
        ...result,
        aiReport
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    setResult(null);
    setError(null);
    setAssessmentData(null);
  };

  return (
    <div className="min-h-screen bg-white">
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
        {error && (
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
      <div className="bg-gray-50 border-t mt-16 sm:mt-20">
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
          onClose={handleCloseModal}
          onSubmit={handleContactSubmit}
          isLoading={isLoading}
          result={result}
          assessmentData={assessmentData}
        />
      )}
    </div>
  );
}
