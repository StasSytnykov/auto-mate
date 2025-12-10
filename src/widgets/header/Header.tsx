import { Car, Sparkles } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Auto</span>
            <span className="text-blue-400">Mate</span>
          </span>
        </div>
        <Badge
          variant="outline"
          className="border-slate-700 bg-slate-800/50 text-slate-400 gap-1.5"
        >
          <Sparkles className="h-3 w-3" />
          Powered by Gemini
        </Badge>
      </div>
    </header>
  );
}

