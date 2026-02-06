'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50 mx-auto">
          <Search className="h-10 w-10 text-slate-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl text-slate-300 mb-2">Сторінку не знайдено</h2>
        <p className="text-slate-500 mb-8">
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            На головну
          </Link>
        </Button>
      </div>
    </div>
  );
}
