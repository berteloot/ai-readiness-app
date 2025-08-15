'use client';

import { useState } from 'react';
import AssessmentForm from '@/components/AssessmentForm';
import { z } from 'zod';

type FormData = z.infer<typeof import('@/components/AssessmentForm').default extends React.ComponentType<infer P> ? P : never>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Assessment Complete! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI Readiness report has been generated and sent to your email. 
              Check your inbox for detailed insights and actionable recommendations.
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Results</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Score Display */}
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-6xl font-bold text-blue-600 mb-3">
                  {result.score}
                </div>
                <div className="text-2xl text-gray-700 mb-2">out of 29</div>
                <div className="text-lg text-gray-600">Total Score</div>
                <div className="mt-4 text-sm text-blue-700 font-medium">
                  {result.message || 'Score calculated based on your responses'}
                </div>
              </div>
              
              {/* Tier Display */}
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-3">
                  {result.tier}
                </div>
                <div className="text-xl text-gray-700 mb-2">Readiness Tier</div>
                <div className="text-lg text-gray-600">Your Current Level</div>
                <div className="mt-4 text-sm text-green-700 font-medium">
                  {result.tier === 'AI-Enhanced' && 'Ready for advanced AI implementation'}
                  {result.tier === 'Getting Started' && 'Good foundation, ready to begin AI journey'}
                  {result.tier === 'Not Ready Yet' && 'Focus on building foundational capabilities'}
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">Immediate Actions</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✅</span>
                      Check your email for the detailed report
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">📊</span>
                      Review your readiness breakdown by section
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">🛣️</span>
                      Follow the 30-60-90 day roadmap
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">Next Steps</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-3">🚀</span>
                      Start with the quick wins identified
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-3">📈</span>
                      Track progress with the suggested KPIs
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-3">💡</span>
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
                setError(null);
              }}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI Readiness Assessment
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Evaluate your organization's readiness for AI transformation with our comprehensive assessment. 
              Get a personalized report with actionable insights and a roadmap for success.
            </p>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Evaluation</h3>
                <p className="text-gray-600 text-sm">9 key areas covering technology, data, workforce, and strategy</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Insights</h3>
                <p className="text-gray-600 text-sm">Personalized recommendations and actionable roadmap</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-600 text-sm">Detailed report sent directly to your email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment */}
      <div className="py-12">
        {error && (
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Submission Error</h3>
                  <div className="mt-2 text-red-700">{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AssessmentForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-gray-500 mb-4">
              <p className="text-lg">AI Readiness Assessment Tool</p>
              <p className="text-sm">Powered by Next.js, OpenAI, and modern web technologies</p>
            </div>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
