'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check, MessageSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { useFeedback } from '../api/use-feedback';
import { FeedbackRating } from '../model/types';

interface FeedbackWidgetProps {
  vehicle?: string;
}

export function FeedbackWidget({ vehicle }: FeedbackWidgetProps) {
  const { submitFeedback, isSubmitting, isSubmitted, error } = useFeedback({ vehicle });
  const [selectedRating, setSelectedRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open modal with a delay after component mounts (analysis complete)
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1);
    return () => clearTimeout(timer);
  }, []);

  const handleRatingClick = (rating: FeedbackRating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (!selectedRating) return;
    submitFeedback(selectedRating, comment.trim() || undefined);
  };

  const handleSkip = () => {
    if (!selectedRating) return;
    submitFeedback(selectedRating);
  };

  // Close dialog after successful submission
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Оцініть аналіз
          </DialogTitle>
          <DialogDescription>
            Ваш відгук допоможе нам покращити якість аналізу
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex items-center justify-center gap-2 py-6 text-green-400">
            <Check className="h-5 w-5" aria-hidden="true" />
            <span className="text-base">Дякуємо за відгук!</span>
          </div>
        ) : selectedRating ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-sm text-slate-400">Ваша оцінка:</span>
              {selectedRating === 'positive' ? (
                <ThumbsUp className="h-5 w-5 text-green-400" />
              ) : (
                <ThumbsDown className="h-5 w-5 text-red-400" />
              )}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ваш коментар (необов'язково)..."
              maxLength={500}
              className="bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{comment.length}/500</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Пропустити
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  Надіслати
                </Button>
              </div>
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-base text-slate-300">Чи корисний цей аналіз?</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleRatingClick('positive')}
                className="border-slate-700/50 text-slate-300 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/10 gap-2 px-6"
                aria-label="Корисний"
              >
                <ThumbsUp className="h-5 w-5" />
                Так
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleRatingClick('negative')}
                className="border-slate-700/50 text-slate-300 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 gap-2 px-6"
                aria-label="Не корисний"
              >
                <ThumbsDown className="h-5 w-5" />
                Ні
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
