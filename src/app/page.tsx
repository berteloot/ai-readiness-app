'use client';

import { useState } from 'react';
import AssessmentForm from '@/components/AssessmentForm';
import ContactModal from '@/components/ContactModal';
import { z } from 'zod';

interface FormData {
  q1: string[];
  q2: string;
  q3: string;
  q4: string;
  q5: string[];
  q6: string[];
  q7: string;
  company?: string;
}

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
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
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
    <div className="min-h-screen bg-paper-offwhite">
      {/* Hero Header */}
      <div className="bg-white shadow-card border-b border-soft-slate">
        <div className="max-w-4xl mx-auto mobile-optimized py-16 sm:py-20 md:py-28">
          <div className="text-center">
            {/* Lean Solutions Group Logo */}
            <div className="mb-8">
              <img 
                src="/LSG_Logo_Horizontal_RGB_Lean%20Blue.png"
                alt="Lean Solutions Group"
                className="h-[5.2rem] mx-auto"
              />
            </div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 lsg-reveal">
              <img 
                src="/lsg_icon_ai-01.svg"
                alt="AI Icon"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-lean-blue uppercase mb-6 sm:mb-8 leading-tight">
              Bridge the Gap Between Customer Experience (CX) Goals and AI Execution
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Evaluate your readiness across data, tools, and team, and get a personalized report with actionable insights and a roadmap to turn vision into results.
            </p>            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto lsg-stagger">
              <div className="text-center p-4 sm:p-6 bg-white rounded-md shadow-card border border-soft-slate lsg-reveal">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                  <img 
                    src="/lsg_icon_star-02.svg"
                    alt="Star Icon"
                    className="w-12 h-12 sm:w-16 sm:h-16"
                  />
                </div>
                <h3 className="font-bold text-midnight-core mb-2 sm:mb-3 text-base sm:text-lg">Comprehensive Evaluation</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">9 key areas covering technology, data, workforce, and strategy</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white rounded-md shadow-card border border-soft-slate lsg-reveal">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                  <img 
                    src="/lsg_icon_timer-02.svg"
                    alt="Timer Icon"
                    className="w-12 h-12 sm:w-16 sm:h-16"
                  />
                </div>
                <h3 className="font-bold text-midnight-core mb-2 sm:mb-3 text-base sm:text-lg">Instant Delivery</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">Detailed report sent directly to your email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment */}
      <div className="py-12 sm:py-16">
        {error ? (
          <div className="max-w-4xl mx-auto mobile-optimized mb-6 sm:mb-8">
            <div className="bg-error/10 border border-error/20 rounded-md p-4 sm:p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-error">Submission Error</h3>
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base text-error">{error}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <AssessmentForm onSubmit={handleAssessmentComplete} isLoading={isLoading} />
      </div>

      {/* Footer */}
      <div className="bg-midnight-core border-t border-trust-navy mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto mobile-optimized py-8 sm:py-12">
          <div className="text-center">
            <div className="text-white mb-3 sm:mb-4">
              <p className="text-base sm:text-lg">CX - AI Readiness Assessment Tool</p>
              <p className="text-xs sm:text-sm">Powered by Lean Solutions Group</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-soft-slate">
              <a href="/privacy-policy" className="hover:text-solar-orange transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-solar-orange transition-colors">Terms of Service</a>
            </div>
            <div className="mt-6 text-xs text-neutral-500">
              <p>© 2025 Lean Solutions Group. All rights reserved.</p>
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
