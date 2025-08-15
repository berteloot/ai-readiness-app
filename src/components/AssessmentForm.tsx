'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { questions } from '@/data/questions';
import { Answers } from '@/lib/scoring';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent: z.boolean().refine(val => val === true, 'You must consent to receive your report'),
  q1: z.array(z.string()).min(1, 'Please select at least one option'),
  q2: z.string().min(1, 'Please select an option'),
  q3: z.string().min(1, 'Please select an option'),
  q4: z.string().min(1, 'Please select an option'),
  q5: z.array(z.string()).min(1, 'Please select at least one option'),
  q6: z.array(z.string()).min(1, 'Please select at least one option'),
  q7: z.string().min(1, 'Please select an option'),
  q8: z.array(z.string()).max(3, 'Please select up to 3 options'),
  q9: z.string().min(1, 'Please select an option'),
});

type FormData = z.infer<typeof formSchema>;

interface AssessmentFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export default function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<FormData>>({});
  const [showProgress, setShowProgress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q1: [],
      q5: [],
      q6: [],
      q8: [],
    },
  });

  const watchedValues = watch();

  // Show progress bar after first question
  useEffect(() => {
    if (currentQuestion > 0) {
      setShowProgress(true);
    }
  }, [currentQuestion]);

  const handleMultiSelect = (questionId: keyof FormData, value: string, maxSelections?: number) => {
    const currentValues = watchedValues[questionId] as string[] || [];
    let newValues: string[];

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      if (maxSelections && currentValues.length >= maxSelections) {
        // Remove the first item and add the new one (FIFO)
        newValues = [...currentValues.slice(1), value];
      } else {
        newValues = [...currentValues, value];
      }
    }
    
    setValue(questionId, newValues);
    setAnswers(prev => ({ ...prev, [questionId]: newValues }));
  };

  const handleSingleSelect = (questionId: keyof FormData, value: string) => {
    setValue(questionId, value);
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = async () => {
    const questionId = questions[currentQuestion].id as keyof FormData;
    const isValid = await trigger(questionId);
    
    if (isValid) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderQuestion = (question: typeof questions[0]) => {
    const currentValue = watchedValues[question.id as keyof FormData];

    switch (question.type) {
      case 'multi':
        return (
          <div className="space-y-4">
            {question.options.map((option) => {
              const isSelected = Array.isArray(currentValue) && currentValue.includes(option.value);
              const isDisabled = Boolean(question.maxSelections && 
                Array.isArray(currentValue) && 
                currentValue.length >= question.maxSelections && 
                !isSelected);
              
              return (
                <label 
                  key={option.value} 
                  className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                    checked={isSelected}
                    onChange={() => handleMultiSelect(question.id as keyof FormData, option.value, question.maxSelections)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">{option.label}</div>
                    <div className="text-gray-600 mt-1">{option.description}</div>
                    {question.maxSelections && (
                      <div className="text-sm text-gray-500 mt-2">
                        {Array.isArray(currentValue) ? currentValue.length : 0} of {question.maxSelections} selected
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        );

      case 'single':
        return (
          <div className="space-y-4">
            {question.options.map((option) => {
              const isSelected = currentValue === option.value;
              
              return (
                <label 
                  key={option.value} 
                  className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    checked={isSelected}
                    onChange={() => handleSingleSelect(question.id as keyof FormData, option.value)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">{option.label}</div>
                    <div className="text-gray-600 mt-1">{option.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  
  const canProceed = () => {
    const questionId = currentQ.id as keyof FormData;
    const value = watchedValues[questionId];
    
    if (currentQ.type === 'multi') {
      if (currentQ.maxSelections) {
        return Array.isArray(value) && value.length > 0 && value.length <= currentQ.maxSelections;
      }
      return Array.isArray(value) && value.length > 0;
    } else if (currentQ.type === 'single') {
      return value && value !== '';
    }
    return false;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Progress Bar */}
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getProgressPercentage())}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`pt-${showProgress ? '24' : '8'} pb-16`}>
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              {/* Question Header */}
              <div className="mb-8">
                {!isFirstQuestion && (
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {currentQ.category}
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentQ.title}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                {renderQuestion(currentQ)}
              </div>

              {/* Error Message */}
              {errors[currentQ.id as keyof FormData] && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {errors[currentQ.id as keyof FormData]?.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={isFirstQuestion}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  ← Previous
                </button>

                {!isLastQuestion ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!canProceed()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed() || isLoading}
                    className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Report...
                      </span>
                    ) : (
                      'Get My Report'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Email and Consent (shown on first question) */}
            {isFirstQuestion && (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 border-t-4 border-blue-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <input
                      {...register('consent')}
                      type="checkbox"
                      id="consent"
                      className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                      I consent to receive my AI Readiness report via email. I understand that my responses will be used to generate a personalized report and may be stored for analysis purposes.
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="mt-2 text-sm text-red-600">{errors.consent.message}</p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
