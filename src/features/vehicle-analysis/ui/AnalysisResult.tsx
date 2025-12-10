'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Wrench, Clock, Car, MapPin, Fuel, Settings, Copy, Check, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { AnalysisResult as AnalysisResultType, DecodedVIN } from '../model/types';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  isLoading: boolean;
}

function DecodedVINCard({ vin }: { vin: DecodedVIN }) {
  const specs = [
    { icon: Car, label: 'Марка/Модель', value: `${vin.make} ${vin.model}` },
    { icon: Clock, label: 'Рік', value: vin.year ? vin.year.toString() : 'Невідомо' },
    {
      icon: Settings,
      label: 'Двигун',
      value: `${vin.engineType} ${vin.engineDisplacement}`.replace('Невідомо Невідомо', 'Невідомо'),
    },
    { icon: Fuel, label: 'Паливо', value: vin.fuelType },
    { icon: Wrench, label: 'Трансмісія', value: vin.transmission },
    { icon: MapPin, label: 'Країна', value: vin.plantCountry },
  ];

  const hasWarnings = vin.checksumValid === false || vin.errorCode;
  const isLocalDecoding = vin.decodingSource === 'local';

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-200">Декодований VIN</CardTitle>
          <div className="flex gap-2">
            {vin.isEuropeanVIN && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                🇪🇺 Європейський VIN
              </Badge>
            )}
            {isLocalDecoding && (
              <Badge variant="secondary" className="bg-slate-500/20 text-slate-400 text-xs">
                Локальний аналіз
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <spec.icon className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{spec.label}</p>
                <p className="text-sm text-slate-200">
                  {spec.value === 'Невідомо' ? <span className="text-slate-500 italic">{spec.value}</span> : spec.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Warnings section */}
        {hasWarnings && (
          <div className="mt-4 space-y-2">
            {vin.checksumValid === false && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">
                  🚨 <strong>УВАГА:</strong> Контрольна сума VIN не пройшла валідацію. Це може означати помилку при
                  введенні або перебитий VIN-код!
                </p>
              </div>
            )}
            {vin.errorCode && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <p className="text-sm text-yellow-400">⚠️ {vin.errorText || 'Деякі дані можуть бути неповними'}</p>
              </div>
            )}
          </div>
        )}

        {/* Info about local decoding */}
        {isLocalDecoding && !hasWarnings && (
          <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
            <p className="text-sm text-blue-400">
              ℹ️ Європейський VIN декодовано локально. Деякі деталі (двигун, трансмісія) можуть бути недоступні без
              повної бази даних.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-16 bg-slate-700 mb-2" />
                <Skeleton className="h-4 w-24 bg-slate-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-6 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-3/4 bg-slate-700" />
          <Skeleton className="h-6 w-48 bg-slate-700 mt-6" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-2/3 bg-slate-700" />
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
          <Wrench className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">Результат аналізу з&apos;явиться тут</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Заповніть форму зліва, вкажіть VIN код та натисніть кнопку для отримання звіту.
        </p>
      </CardContent>
    </Card>
  );
}

export function AnalysisResult({ result, isLoading }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <AnalysisSkeleton />;
  }

  if (!result) {
    return <EmptyState />;
  }

  const handleCopy = async () => {
    try {
      // Create a text version of the analysis
      let textContent = '';

      if (result.decodedVIN) {
        textContent += `=== Декодований VIN ===\n`;
        textContent += `Марка/Модель: ${result.decodedVIN.make} ${result.decodedVIN.model}\n`;
        textContent += `Рік: ${result.decodedVIN.year}\n`;
        textContent += `Країна: ${result.decodedVIN.plantCountry}\n\n`;
      }

      textContent += `=== AI Аналіз ===\n\n`;
      textContent += result.analysis;
      textContent += `\n\n---\nАналіз виконано: ${new Date(result.timestamp).toLocaleString('uk-UA')}`;
      textContent += `\nAutoMate - AI Перевірка Автомобілів`;

      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AutoMate - Аналіз автомобіля',
          text: `Аналіз ${result.decodedVIN?.make || ''} ${result.decodedVIN?.model || ''} ${
            result.decodedVIN?.year || ''
          }`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      {/* Decoded VIN Info */}
      {result.decodedVIN && <DecodedVINCard vin={result.decodedVIN} />}

      {/* AI Analysis */}
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-200">AI Аналіз</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-400" />
                    <span className="text-green-400">Скопійовано</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Копіювати
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Поділитися
              </Button>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Powered by Gemini
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-200 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-200 prose-a:text-blue-400">
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Timestamp */}
      <p className="text-center text-xs text-slate-600">
        Аналіз виконано: {new Date(result.timestamp).toLocaleString('uk-UA')}
      </p>
    </div>
  );
}
