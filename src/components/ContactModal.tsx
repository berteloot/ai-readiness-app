'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { convertMarkdownToSafeHTML } from '@/lib/sanitizer';

// Blocked email domains to prevent generic/personal emails
const blockedDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com'
];

const contactSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .refine((val) => {
      const domain = val.split('@')[1]?.toLowerCase();
      return domain && !blockedDomains.includes(domain);
    }, { message: 'Please use your company email address' }),
  company: z.string().min(1, 'Please enter your company name'),
  consent: z.boolean().refine(val => val === true, 'You must consent to receive your report'),
});

type ContactData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactData) => void;
  onStartOver?: () => void;
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

// SECURITY: Removed vulnerable convertMarkdownToHTML function
// Now using secure sanitizer from @/lib/sanitizer

export default function ContactModal({ isOpen, onClose, onSubmit, onStartOver, isLoading, result, assessmentData }: ContactModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const watchedValues = watch();



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
              <p className="text-text-secondary">Enter your business details to receive your AI Readiness report</p>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Please use your company email address. Personal email addresses (Gmail, Yahoo, etc.) are not accepted.
                </p>
              </div>

            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">
                  Company Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-lg transition-all duration-200"
                  placeholder="your.name@company.com"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Use your work email address (e.g., john.smith@acmecorp.com)
                </div>
                {errors.email && (
                  <div className="mt-2">
                    <p className="text-sm text-error">{errors.email.message}</p>
                  </div>
                )}

              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-text-secondary mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 border border-border-default rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-all duration-200"
                  placeholder="Acme Corporation"
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
                <div className="text-lg text-text-secondary mb-2">out of {result.maxScore || 53} points</div>
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
                      __html: convertMarkdownToSafeHTML(result.aiReport) 
                    }}
                  />
                </div>
                <div className="mt-3 text-xs text-neutral-500 text-center">
                  A copy of this report has been sent to your email.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 border-t border-border-default">
              {/* Learn More Button */}
              <a
                href="https://www.leangroup.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-primary text-center"
              >
                Learn More
              </a>
              
              {/* Close and Start Over Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
                {onStartOver && (
                  <button
                    onClick={onStartOver}
                    className="flex-1 btn-accent"
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
