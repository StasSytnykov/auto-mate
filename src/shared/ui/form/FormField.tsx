import * as React from 'react';
import { Label } from '@/shared/ui/label';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  labelIcon?: React.ReactNode;
  labelSuffix?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  labelIcon,
  labelSuffix,
  children,
  className,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor={id} className="flex items-center gap-2 text-slate-300">
        {labelIcon}
        {label}
        {required && (
          <span className="text-red-400" aria-label="обов'язкове поле">
            *
          </span>
        )}
        {labelSuffix}
      </Label>

      {children}

      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
