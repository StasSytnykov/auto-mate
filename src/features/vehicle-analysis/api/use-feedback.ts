'use client';

import { useState, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { FeedbackRating } from '../model/types';

interface UseFeedbackOptions {
  vehicle?: string;
}

export function useFeedback({ vehicle }: UseFeedbackOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState<FeedbackRating | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(
    async (rating: FeedbackRating, comment?: string) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, comment, vehicle }),
        });

        if (!response.ok) {
          throw new Error('Не вдалося надіслати відгук');
        }

        setIsSubmitted(true);
        setSubmittedRating(rating);

        track('feedback_submitted', {
          rating,
          hasComment: !!comment,
          vehicle: vehicle || 'unknown',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не вдалося надіслати відгук');
      } finally {
        setIsSubmitting(false);
      }
    },
    [vehicle]
  );

  return {
    submitFeedback,
    isSubmitting,
    isSubmitted,
    submittedRating,
    error,
  };
}
