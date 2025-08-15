'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PDFGenerator from './PDFGenerator';

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Please enter your company name'),
  consent: z.boolean().refine(val => val === true, 'You must consent to receive your report'),
});

type ContactData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactData) => void;
  isLoading?: boolean;
  result?: {
    score: number;
    tier: string;
    breakdown: Record<string, number>;
    maxScore: number;
    aiReport?: string;
  } | null;
  assessmentData?: {
    company?: string;
  } | null;
}

// Simple markdown to HTML converter
function convertMarkdownToHTML(markdown: string): string {
  return markdown
    // Convert headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-gray-800">$1</em>')
    // Convert line breaks
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Convert single line breaks
    .replace(/\n/g, '<br>')
    // Wrap in paragraphs
    .replace(/^(.*)$/gm, '<p class="mb-3">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-3"><\/p>/g, '')
    // Remove extra paragraph wrappers
    .replace(/<p class="mb-3"><p class="mb-3">/g, '<p class="mb-3">')
    .replace(/<\/p><\/p>/g, '</p>');
}

export default function ContactModal({ isOpen, onClose, onSubmit, isLoading, result, assessmentData }: ContactModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });



  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className={`modal-content ${
        result ? 'p-6' : 'p-8'
      } animate-slide-up`}>
        
        {!result ? (
          // Contact Form
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 accent-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Report</h3>
              <p className="text-gray-600">Enter your details to receive your AI Readiness report</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-lg transition-all duration-200"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-lg transition-all duration-200"
                  placeholder="Your Company"
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
                <input
                  {...register('consent')}
                  type="checkbox"
                  id="consent"
                  className="mt-1 h-5 w-5 text-accent-600 rounded border-gray-300 focus:ring-accent-500 focus:ring-2"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                  I consent to receive my AI Readiness report via email. I understand that my responses will be used to generate a personalized report and may be stored for analysis purposes.
                </label>
              </div>
              {errors.consent && (
                <p className="mt-2 text-sm text-red-600">{errors.consent.message}</p>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 'Get Report'}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Results Display
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete! 🎉</h3>
              <p className="text-gray-600">Your AI Readiness report has been generated and sent to your email</p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Score Display */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {typeof result.score === 'number' ? result.score : 'N/A'}
                </div>
                <div className="text-lg text-gray-700 mb-2">out of {result.maxScore || 29} points</div>
                <div className="text-base text-gray-600">Total Score</div>
              </div>
              
              {/* Tier Display */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {result.tier || 'N/A'}
                </div>
                <div className="text-lg text-gray-700 mb-2">Readiness Tier</div>
                <div className="text-base text-gray-600">Your Current Level</div>
              </div>
            </div>

            {/* AI Report Preview */}
            {result.aiReport && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  AI-Generated Analysis & Recommendations
                </h4>
                <div className="bg-white p-6 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: convertMarkdownToHTML(result.aiReport) 
                    }}
                  />
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Full report has been sent to your email
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
              <PDFGenerator 
                result={result} 
                aiReport={result.aiReport || ''} 
                company={assessmentData?.company || 'Your Company'} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
