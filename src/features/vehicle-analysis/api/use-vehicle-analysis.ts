'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState, useCallback } from 'react';
import { VehicleFormData, DecodedVIN } from '../model/types';

interface DecodeVINResponse {
  decodedVIN: DecodedVIN | null;
  timestamp: string;
  error?: string;
  message?: string;
}

interface UseVehicleAnalysisOptions {
  onVINDecoded?: (decodedVIN: DecodedVIN | null) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export function useVehicleAnalysis(options: UseVehicleAnalysisOptions = {}) {
  const [decodedVIN, setDecodedVIN] = useState<DecodedVIN | null>(null);
  const [isDecodingVIN, setIsDecodingVIN] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);

  const {
    complete,
    completion,
    isLoading: isStreaming,
    error: streamError,
    stop,
  } = useCompletion({
    api: '/api/analyze',
    streamProtocol: 'text',
    onFinish: () => {
      options.onComplete?.();
    },
    onError: (error: Error) => {
      options.onError?.(error.message);
    },
  });

  const startAnalysis = useCallback(
    async (formData: VehicleFormData) => {
      setDecodedVIN(null);
      setVinError(null);

      setIsDecodingVIN(true);
      let vinResult: DecodedVIN | null = null;

      try {
        const vinResponse = await fetch('/api/decode-vin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin: formData.vin }),
        });

        const vinData: DecodeVINResponse = await vinResponse.json();

        if (vinData.decodedVIN) {
          vinResult = vinData.decodedVIN;
          setDecodedVIN(vinResult);
          options.onVINDecoded?.(vinResult);
        } else if (vinData.error) {
          setVinError(vinData.message || 'VIN decode failed');
        }
      } catch (error) {
        console.error('VIN decode error:', error);
        setVinError('Failed to decode VIN');
      } finally {
        setIsDecodingVIN(false);
      }

      await complete('', {
        body: {
          ...formData,
          decodedVIN: vinResult,
        },
      });
    },
    [complete, options]
  );

  return {
    startAnalysis,
    decodedVIN,
    streamedText: completion,
    isDecodingVIN,
    isStreaming,
    isLoading: isDecodingVIN || isStreaming,
    error: vinError || (streamError?.message ?? null),
    stop,
  };
}
