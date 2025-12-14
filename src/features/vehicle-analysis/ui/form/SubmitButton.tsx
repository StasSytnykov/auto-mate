'use client';

import * as React from 'react';
import { Car, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-6"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Аналізую...
        </>
      ) : (
        <>
          <Car className="mr-2 h-5 w-5" />
          Аналізувати авто
        </>
      )}
    </Button>
  );
}
