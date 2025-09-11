'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { questions } from '@/data/questions';
import { enforceNoneExclusive } from '@/lib/selection';

/* If your questions.ts includes sector and region, keep these in the schema.
   If not, remove sector and region from the schema and defaultValues. */
const formSchema = z.object({
  sector: z.string().optional(),
  region: z.string().optional(),

  q1: z.array(z.string()).min(1, 'Please select at least one option'),
  q2: z.string().min(1, 'Please select an option'),
  q3: z.string().min(1, 'Please select an option'),
  q4: z.string().min(1, 'Please select an option'),
  q5: z.array(z.string()).min(1, 'Please select at least one option'),
  q6: z.array(z.string()).min(1, 'Please select at least one option'),
  q7: z.string().min(1, 'Please select an option'),
  q8: z.array(z.string()).min(1, 'Please select at least one option'),
  q9: z.string().min(1, 'Please select an option'),
});

type FormData = z.infer<typeof formSchema>;

interface AssessmentFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export default function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: undefined,
      region: undefined,

      q1: [],
      q2: '',
      q3: '',
      q4: '',
      q5: [],
      q6: [],
      q7: '',
      q8: [],
      q9: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    setCurrentQuestion(0);
    reset({
      sector: undefined,
      region: undefined,

      q1: [],
      q2: '',
      q3: '',
      q4: '',
      q5: [],
      q6: [],
      q7: '',
      q8: [],
      q9: '',
    });
  }, [reset]);

  // Multi-select with “None” exclusivity and optional maxSelections
  const handleMultiSelect = (
    questionId: keyof FormData,
    value: string,
    maxSelections?: number
  ) => {
    const currentValues = (watchedValues[questionId] as string[]) || [];

    if (value === 'none') {
      // Selecting None clears others; deselecting None leaves empty
      if (currentValues.includes('none')) {
        setValue(questionId, [] as any);
      } else {
        setValue(questionId, ['none'] as any);
      }
      return;
    }

    // Selecting any real option deselects None
    const base = currentValues.filter((x) => x !== 'none');

    if (currentValues.includes(value)) {
      // Deselect option
      const newValues = base.filter((x) => x !== value);
      setValue(questionId, newValues as any);
    } else {
      // Select option
      let newValues = [...base, value];

      if (maxSelections && newValues.length > maxSelections) {
        // Keep most recent selections within the cap
        newValues = newValues.slice(-maxSelections);
      }

      setValue(questionId, newValues as any);
    }
  };

  const handleSingleSelect = (questionId: keyof FormData, value: string) => {
    setValue(questionId, value as any);
  };

  const nextQuestion = async () => {
    const questionId = questions[currentQuestion].id as keyof FormData;
    const isValid = await trigger(questionId);
    if (isValid && currentQuestion < questions.length - 1) {
      setCurrentQuestion((n) => n + 1);
      setTimeout(() => {
        const progressBar = document.querySelector('.progress-section');
        if (progressBar) {
          const rect = progressBar.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 20;
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((n) => n - 1);
      setTimeout(() => {
        const progressBar = document.querySelector('.progress-section');
        if (progressBar) {
          const rect = progressBar.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 20;
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Final submit handler: clean multi-selects so “none” is exclusive
  const onSubmitClean = (raw: FormData) => {
    const cleaned: FormData = {
      ...raw,
      q1: enforceNoneExclusive(raw.q1 || []),
      q5: enforceNoneExclusive(raw.q5 || []),
      q6: enforceNoneExclusive(raw.q6 || []),
      q8: enforceNoneExclusive(raw.q8 || []),
    };
    onSubmit(cleaned);
  };

  const renderQuestion = (question: any) => {
    const currentValue = watchedValues[question.id as keyof FormData];

    switch (question.type) {
      case 'multi':
        return (
          <div className="space-y-4">
            <div className="bg-lean-blue/10 border border-lean-blue/20 text-lean-blue mb-6 p-3 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Multiple Choice - Select all that apply</span>
              </div>
            </div>
            <div className="grid gap-4">
              {question.options.map((option: any) => {
                const isSelected =
                  Array.isArray(currentValue) && currentValue.includes(option.value);

                return (
                  <label
                    key={option.value}
                    className={`
                      relative block p-6 rounded-md border-2 transition-all duration-200 cursor-pointer lsg-transition
                      ${isSelected ? 'border-lean-blue bg-lean-blue/5 shadow-card'
                                   : 'border-soft-slate hover:border-lean-blue hover:shadow-card'}
                    `}
                  >
                    <input
                      type="checkbox"
                      name={question.id}
                      className="sr-only"
                      checked={isSelected}
                      onChange={() =>
                        handleMultiSelect(
                          question.id as keyof FormData,
                          option.value,
                          question.maxSelections
                        )
                      }
                    />
                    <div className="flex items-start space-x-4">
                      <div
                        className={`
                          flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center
                          ${isSelected ? 'border-lean-blue bg-lean-blue'
                                       : 'border-soft-slate'}
                        `}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-midnight-core text-lg mb-2">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-neutral-600 text-base leading-relaxed">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'single':
        return (
          <div className="space-y-4">
            <div className="bg-solar-orange/10 border border-solar-orange/20 text-solar-orange mb-6 p-3 rounded-md">
              <div className="flex items-center">
                <img 
                  src="/lsg_icon_star-02.svg"
                  alt="Star Icon"
                  className="w-5 h-5 mr-2"
                />
                <span className="font-medium">Single Choice - Select one option</span>
              </div>
            </div>
            <div className="grid gap-4">
              {question.options.map((option: any) => {
                const isSelected = currentValue === option.value;

                return (
                  <label
                    key={option.value}
                    className={`
                      relative block p-6 rounded-md border-2 transition-all duration-200 cursor-pointer lsg-transition
                      ${isSelected ? 'border-solar-orange bg-solar-orange/5 shadow-card'
                                   : 'border-soft-slate hover:border-solar-orange hover:shadow-card'}
                    `}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleSingleSelect(question.id as keyof FormData, option.value)}
                    />
                    <div className="flex items-start space-x-4">
                      <div
                        className={`
                          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${isSelected ? 'border-solar-orange bg-solar-orange'
                                       : 'border-soft-slate'}
                        `}
                      >
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-midnight-core text-lg mb-2">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-neutral-600 text-base leading-relaxed">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
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
    const q = questions[currentQuestion];
    const val = watchedValues[q.id as keyof FormData];
    if (q.type === 'multi') return Array.isArray(val) && val.length > 0;
    return Boolean(val);
  };

  return (
    <div className="min-h-screen bg-paper-offwhite">
      <div className="pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit(onSubmitClean)} className="space-y-8">
            {/* Progress Bar */}
            <div className="mb-8 progress-section">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-neutral-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-lean-blue">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-soft-slate rounded-full h-2">
                <div
                  className="bg-lean-blue h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="question-card lsg-reveal">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-midnight-core mb-4 leading-tight">
                  {currentQ.title}
                </h2>
                <div className="text-xl text-neutral-600 leading-relaxed">
                  {currentQ.subtitle.split('\n').map((line, index) => (
                    <p key={index} className={index > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mb-8">{renderQuestion(currentQ)}</div>

              {/* Error Display */}
              {errors[currentQ.id as keyof FormData] && (
                <div className="mb-6">
                  <div className="flex items-start p-4 bg-error/10 border border-error/20 rounded-md">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-error" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-error">
                        {errors[currentQ.id as keyof FormData]?.message as any}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-soft-slate">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={isFirstQuestion}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-soft-slate text-neutral-600 rounded-md hover:bg-soft-slate transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {!isLastQuestion ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!canProceed()}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-lean-blue text-white rounded-md hover:bg-momentum-blue transition-all duration-200 font-semibold text-base sm:text-lg shadow-card hover:shadow-popover transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed() || isLoading}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-lean-blue text-white rounded-md hover:bg-momentum-blue transition-all duration-200 font-semibold text-base sm:text-lg shadow-card hover:shadow-popover transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
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
          </form>
        </div>
      </div>
    </div>
  );
}