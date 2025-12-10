'use client';

import { useState } from 'react';
import { VehicleForm, AnalysisResult } from '@/features/vehicle-analysis';
import type { AnalysisResultType } from '@/features/vehicle-analysis';

export default function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResultType) => {
    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisResult(null);
  };

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
          Штучний інтелект проаналізує VIN, історію моделі та стан автомобіля, щоб
          надати об&apos;єктивну рекомендацію: купувати чи шукати далі.
        </p>
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Form */}
        <div className="lg:sticky lg:top-24">
          <VehicleForm
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisStart={handleAnalysisStart}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Results */}
        <div>
          <AnalysisResult result={analysisResult} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
