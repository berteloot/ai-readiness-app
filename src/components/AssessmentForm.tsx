'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { questions } from '@/data/questions';

const formSchema = z.object({
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
  const [showProgress, setShowProgress] = useState(false);

  const {
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
    
    // Clean, accessible multi-select with exclusive "None of the above"
    if (value === 'none') {
      // Selecting None clears others; deselecting None leaves all off
      if (currentValues.includes('none')) {
        setValue(questionId, []);
      } else {
        setValue(questionId, ['none']);
      }
      return;
    }
    
    // Selecting any real option deselects None
    const base = currentValues.filter(x => x !== 'none');
    if (currentValues.includes(value)) {
      // Deselect option
      const newValues = base.filter(x => x !== value);
      setValue(questionId, newValues);
    } else {
      // Select option
      let newValues = [...base, value];
      
      if (maxSelections && newValues.length > maxSelections) {
        // Remove oldest selection (FIFO)
        newValues = newValues.slice(-maxSelections);
      }
      
      setValue(questionId, newValues);
    }
  };

  const handleSingleSelect = (questionId: keyof FormData, value: string) => {
    setValue(questionId, value);
  };

  const nextQuestion = async () => {
    const questionId = questions[currentQuestion].id as keyof FormData;
    const isValid = await trigger(questionId);
    
    if (isValid) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // Scroll to top to align question at screen top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Scroll to top to align question at screen top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderQuestion = (question: typeof questions[0]) => {
    const currentValue = watchedValues[question.id as keyof FormData];

    switch (question.type) {
      case 'multi':
        return (
          <div className="space-y-4">
            <div className="question-type-multi mb-6 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Multiple Choice - Select all that apply</span>
                </div>
                {question.maxSelections && (
                  <div className="text-sm text-gray-600">
                    {Array.isArray(currentValue) ? currentValue.length : 0} of {question.maxSelections} selected
                  </div>
                )}
              </div>
              {question.maxSelections && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((Array.isArray(currentValue) ? currentValue.length : 0) / question.maxSelections) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <fieldset className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const isSelected = Array.isArray(currentValue) && currentValue.includes(option.value);
                  const isDisabled = Boolean(question.maxSelections && 
                    Array.isArray(currentValue) && 
                    currentValue.length >= question.maxSelections && 
                    !isSelected);
                  const isMaxReached = Boolean(question.maxSelections && 
                    Array.isArray(currentValue) && 
                    currentValue.length >= question.maxSelections);
                  const isNoneOption = option.value === 'none';
                  
                  return (
                    <label
                      key={option.value}
                      className={[
                        "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition",
                        "border-gray-200 hover:border-gray-300",
                        isSelected ? "bg-accent-50 border-accent-200" : "bg-white",
                        isNoneOption ? "sm:col-span-2" : "",
                        isDisabled ? "opacity-60 cursor-not-allowed" : ""
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                        checked={isSelected}
                        onChange={() => handleMultiSelect(question.id as keyof FormData, option.value, question.maxSelections)}
                        disabled={isDisabled}
                        aria-describedby={`desc-${option.value}`}
                      />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        {option.description && (
                          <span id={`desc-${option.value}`} className="text-sm text-gray-600">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                {Array.isArray(currentValue) && currentValue.includes('none')
                  ? "You selected None of the above, so other options are disabled."
                  : question.maxSelections 
                    ? `You can select up to ${question.maxSelections} options. Selecting any option will deselect None of the above.`
                    : "You can select multiple options. Selecting any option will deselect None of the above."}
              </div>
            </fieldset>
          </div>
        );

      case 'single':
        return (
          <div className="space-y-4">
            <div className="question-type-single mb-6 p-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Single Choice - Select one option</span>
              </div>
            </div>
            <div className="grid gap-4">
              {question.options.map((option) => {
                const isSelected = currentValue === option.value;
                
                return (
                  <label 
                    key={option.value} 
                    className={`
                      relative block p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-accent-500 bg-accent-50 shadow-lg' 
                        : 'border-gray-200 hover:border-accent-300 hover:shadow-md'
                      }
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
                      <div className={`
                        flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected 
                          ? 'border-accent-500 bg-accent-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {isSelected && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg mb-2">{option.label}</div>
                        <div className="text-gray-600 text-base leading-relaxed">{option.description}</div>
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
    const currentQ = questions[currentQuestion];
    const currentValue = watchedValues[currentQ.id as keyof FormData];
    
    if (currentQ.type === 'multi') {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    
    return currentValue && currentValue !== '';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Progress Bar */}
            {showProgress && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-sm font-medium text-accent-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="accent-gradient h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Question Card */}
            <div className="question-card">
                          <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {currentQ.title}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {currentQ.subtitle}
              </p>
            </div>

              <div className="mb-8">
                {renderQuestion(currentQ)}
              </div>

              {/* Error Display */}
              {errors[currentQ.id as keyof FormData] && (
                <div className="mb-6">
                  <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {!isLastQuestion ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!canProceed()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed() || isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        </div>
      </div>
    </div>
  );
}
