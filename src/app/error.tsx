'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mx-auto">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Щось пішло не так</h1>
        <p className="text-slate-500 mb-8">
          Виникла непередбачена помилка. Спробуйте оновити сторінку.
        </p>
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Спробувати знову
        </Button>
      </div>
    </div>
  );
}
