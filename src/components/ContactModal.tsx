'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
}

export default function ContactModal({ isOpen, onClose, onSubmit, isLoading }: ContactModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
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
      </div>
    </div>
  );
}
