'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Wrench, Clock, Car, MapPin, Fuel, Settings, Copy, Check, StopCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { DecodedVIN } from '../model/types';
import { FeedbackWidget } from './FeedbackWidget';

interface AnalysisResultProps {
  decodedVIN: DecodedVIN | null;
  streamedText: string;
  isDecodingVIN: boolean;
  isStreaming: boolean;
  onStop?: () => void;
  onRetry?: () => void;
  error?: string | null;
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
              <spec.icon className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
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

function VINDecodingSkeleton() {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          <Skeleton className="h-5 w-40 bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16 bg-slate-700 mb-2" />
              <Skeleton className="h-4 w-24 bg-slate-700" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-slate-700/50 bg-slate-800/30 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
          <Wrench className="h-8 w-8 text-slate-500" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">Результат аналізу з&apos;явиться тут</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Заповніть форму зліва, вкажіть VIN код та натисніть кнопку для отримання звіту.
        </p>
      </CardContent>
    </Card>
  );
}

function TypingCursor() {
  return <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1" aria-hidden="true" />;
}

export function AnalysisResult({ decodedVIN, streamedText, isDecodingVIN, isStreaming, onStop, onRetry, error }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  const hasContent = decodedVIN || streamedText;
  const isComplete = !isDecodingVIN && !isStreaming && streamedText.length > 0;

  if (!hasContent && !isDecodingVIN && !isStreaming) {
    return <EmptyState />;
  }

  const handleCopy = async () => {
    try {
      let textContent = '';

      if (decodedVIN) {
        textContent += `=== Декодований VIN ===\n`;
        textContent += `Марка/Модель: ${decodedVIN.make} ${decodedVIN.model}\n`;
        textContent += `Рік: ${decodedVIN.year}\n`;
        textContent += `Країна: ${decodedVIN.plantCountry}\n\n`;
      }

      textContent += `=== AI Аналіз ===\n\n`;
      textContent += streamedText;
      textContent += `\n\n---\nAutoMate - AI Перевірка Автомобілів`;

      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };


  const articleTitle = decodedVIN
    ? `Аналіз ${decodedVIN.make} ${decodedVIN.model} ${decodedVIN.year || ''}`
    : 'Аналіз автомобіля';

  return (
    <article aria-label={articleTitle} className="space-y-6">
      {isDecodingVIN && !decodedVIN && (
        <section aria-label="Декодування VIN">
          <VINDecodingSkeleton />
        </section>
      )}

      {decodedVIN && (
        <section aria-label="Декодований VIN">
          <DecodedVINCard vin={decodedVIN} />
        </section>
      )}

      {/* AI Analysis */}
      {(isStreaming || streamedText) && (
        <section aria-label="AI Аналіз">
          <Card className="border-slate-700/50 bg-slate-800/30">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-blue-400" aria-hidden="true" />}
                  <CardTitle className="text-lg text-slate-200">
                    AI Аналіз
                    {isStreaming && <span className="text-sm font-normal text-slate-400 ml-2">(генерується...)</span>}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {isStreaming && onStop && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onStop}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      aria-label="Зупинити генерацію"
                    >
                      <StopCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                      Зупинити
                    </Button>
                  )}
                  {isComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                        aria-label={copied ? 'Скопійовано в буфер обміну' : 'Копіювати аналіз'}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-1 text-green-400" aria-hidden="true" />
                            <span className="text-green-400">Скопійовано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                            Копіювати
                          </>
                        )}
                      </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-200 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-200 prose-a:text-blue-400 prose-hr:border-slate-700/50 prose-blockquote:text-slate-400 prose-blockquote:border-slate-600/50">
                <ReactMarkdown>{streamedText}</ReactMarkdown>
                {isStreaming && <TypingCursor />}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Error with retry */}
      {error && !isStreaming && onRetry && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="flex flex-col items-center py-6 text-center">
            <p className="text-sm text-red-400 mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Timestamp - only show when complete */}
      {isComplete && (
        <footer className="text-center">
          <time dateTime={new Date().toISOString()} className="text-xs text-slate-600">
            Аналіз виконано: {new Date().toLocaleString('uk-UA')}
          </time>
        </footer>
      )}

      {isComplete && (
        <FeedbackWidget
          vehicle={decodedVIN ? `${decodedVIN.make} ${decodedVIN.model} ${decodedVIN.year || ''}`.trim() : undefined}
        />
      )}
    </article>
  );
}
