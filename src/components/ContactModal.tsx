'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { validateBusinessEmail, getEmailValidationMessage } from '@/lib/emailValidation';

const contactSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .refine((email) => {
      const validation = validateBusinessEmail(email);
      return validation.isValid;
    }, 'Please enter a valid email address')
    .refine((email) => {
      const validation = validateBusinessEmail(email);
      return validation.isBusiness; // ONLY allow business emails
    }, 'Business email address required - personal and generic emails are not accepted'),
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
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-text-primary mt-8 mb-4">$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-text-secondary">$1</em>')
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
    watch,
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const watchedValues = watch();

  // Safe email validation with error handling
  const safeEmailValidation = (email: string) => {
    try {
      return validateBusinessEmail(email);
    } catch (error) {
      console.error('Email validation error:', error);
      return { isValid: false, isBusiness: false, reason: 'Validation error occurred' };
    }
  };

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
              <div className="w-16 h-16 accent-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
                <svg className="w-8 h-8 text-text-onAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Get Your Report</h3>
              <p className="text-text-secondary">Enter your details to receive your AI Readiness report</p>
              
              {/* Critical Email Warning */}
              <div className="mt-4 p-4 bg-error/10 border-2 border-error/20 rounded-md">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-error">
                    BUSINESS EMAIL REQUIRED - Personal emails will be rejected
                  </span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">
                  Business Email Address
                  <span className="text-xs font-normal text-error ml-2">(Required - No personal emails)</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-lg transition-all duration-200 ${
                    watchedValues.email ? 
                      (safeEmailValidation(watchedValues.email).isBusiness ? 
                        'border-success bg-success/10' : 
                        'border-error bg-error/10'
                      ) : 
                      'border-border-default'
                  }`}
                  placeholder="your@email.com"
                />
                {watchedValues.email && !errors.email && (
                  <div className="mt-2">
                    {(() => {
                      const validation = safeEmailValidation(watchedValues.email);
                      if (validation.isBusiness) {
                        return (
                          <p className="text-sm text-success flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ✅ Business email verified - Report generation allowed
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-sm text-error flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            ❌ Personal/Generic email - Report generation blocked
                          </p>
                        );
                      }
                    })()}
                  </div>
                )}
                {errors.email && (
                  <div className="mt-2">
                    <p className="text-sm text-error">{errors.email.message}</p>
                    {(() => {
                      const validation = safeEmailValidation(watchedValues.email || '');
                      if (validation.suggestions && validation.suggestions.length > 0) {
                        return (
                          <div className="mt-1 p-2 bg-primary-50 border border-primary-200 rounded-md">
                            <p className="text-xs text-primary-700 font-medium">💡 Tip:</p>
                            {validation.suggestions.map((suggestion, index) => (
                              <p key={index} className="text-xs text-primary-600 mt-1">{suggestion}</p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-xs text-error">
                    <strong>⚠️ STRICT EMAIL REQUIREMENT:</strong> Only business email addresses are accepted. Personal emails (Gmail, Yahoo, etc.) and generic/test emails are NOT allowed. You must use your company email address.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-text-secondary mb-2">
                  Company Name
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 border border-border-default rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-all duration-200"
                  placeholder="Your Company"
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-error">{errors.company.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-4 p-4 bg-accent-50 rounded-md border border-accent-200">
                <input
                  {...register('consent')}
                  type="checkbox"
                  id="consent"
                  className="mt-1 h-5 w-5 text-accent-600 rounded border-border-default focus:ring-accent-500 focus:ring-2"
                />
                <label htmlFor="consent" className="text-sm text-text-secondary leading-relaxed">
                  I consent to receive my AI Readiness report via email. I understand that my responses will be used to generate a personalized report and may be stored for analysis purposes.
                </label>
              </div>
              {errors.consent && (
                <p className="mt-2 text-sm text-error">{errors.consent.message}</p>
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
                  disabled={isLoading || (watchedValues.email && !safeEmailValidation(watchedValues.email).isBusiness)}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 
                   (watchedValues.email && !safeEmailValidation(watchedValues.email).isBusiness) ? 
                   'Business Email Required' : 'Get Report'}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Results Display
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Assessment Complete! 🎉</h3>
              <p className="text-text-secondary">Your AI Readiness report has been generated and sent to your email</p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Score Display */}
              <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-md border border-primary-200">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {typeof result.score === 'number' ? result.score : 'N/A'}
                </div>
                <div className="text-lg text-text-secondary mb-2">out of {result.maxScore || 29} points</div>
                <div className="text-base text-text-secondary">Total Score</div>
              </div>
              
              {/* Tier Display */}
              <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-md border border-accent-200">
                <div className="text-2xl font-bold text-accent-600 mb-2">
                  {result.tier || 'N/A'}
                </div>
                <div className="text-lg text-text-secondary mb-2">Readiness Tier</div>
                <div className="text-base text-text-secondary">Your Current Level</div>
              </div>
            </div>

            {/* AI Report Preview */}
            {result.aiReport && (
              <div className="bg-gradient-to-r from-background-muted to-primary-50 p-6 rounded-md border border-border-default mb-8">
                <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  AI-Generated Analysis & Recommendations
                </h4>
                <div className="bg-background-surface p-6 rounded-md border border-border-default max-h-96 overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none text-sm text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: convertMarkdownToHTML(result.aiReport) 
                    }}
                  />
                </div>
                <div className="mt-3 text-xs text-neutral-500 text-center">
                  Full report has been sent to your email
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border-default">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // TODO: Implement PDF generation if needed
                  console.log('PDF generation not implemented yet');
                }}
                className="flex-1 btn-primary"
              >
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
