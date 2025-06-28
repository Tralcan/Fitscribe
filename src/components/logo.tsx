import { Wind } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="FITscribe Logo">
      <div className="bg-primary/20 p-2 rounded-lg">
        <Wind className="h-8 w-8 text-primary" />
      </div>
    </div>
  );
}
