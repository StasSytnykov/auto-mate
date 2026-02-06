'use client';

import { useState, useCallback, useRef } from 'react';
import { VehicleForm, AnalysisResult, useVehicleAnalysis } from '@/features/vehicle-analysis';
import type { VehicleFormData } from '@/features/vehicle-analysis';

export default function HomePage() {
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastFormDataRef = useRef<VehicleFormData | null>(null);

  const {
    startAnalysis,
    decodedVIN,
    streamedText,
    isDecodingVIN,
    isStreaming,
    isLoading,
    error: analysisError,
    stop,
  } = useVehicleAnalysis({
    onError: (err) => setError(err),
    onComplete: () => {
      // Analysis complete
    },
  });

  const handleFormSubmit = useCallback(
    async (formData: VehicleFormData) => {
      setError(null);
      lastFormDataRef.current = formData;

      // Scroll to results on mobile/desktop
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      await startAnalysis(formData);
    },
    [startAnalysis]
  );

  const handleRetry = useCallback(() => {
    if (lastFormDataRef.current) {
      setError(null);
      startAnalysis(lastFormDataRef.current);
    }
  }, [startAnalysis]);

  // Combine errors
  const displayError = error || analysisError;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-white">Перевір авто перед </span>
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            прийняттям рішення
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Штучний інтелект проаналізує VIN, історію моделі та стан автомобіля, щоб надати об&apos;єктивну рекомендацію:
          купувати чи шукати далі.
        </p>
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Form */}
        <div className="lg:sticky lg:top-24">
          <VehicleForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={displayError}
            decodedVIN={decodedVIN}
          />
        </div>

        {/* Right Column - Results */}
        <div ref={resultsRef}>
          <AnalysisResult
            decodedVIN={decodedVIN}
            streamedText={streamedText}
            isDecodingVIN={isDecodingVIN}
            isStreaming={isStreaming}
            onStop={stop}
            onRetry={handleRetry}
            error={displayError}
          />
        </div>
      </div>
    </div>
  );
}
