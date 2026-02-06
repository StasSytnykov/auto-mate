'use client';

import * as React from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { FormField } from './FormField';

export interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  textareaClassName?: string;
  labelIcon?: React.ReactNode;
  labelSuffix?: React.ReactNode;
  maxLength?: number;
}

export function FormTextarea({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  disabled,
  error,
  hint,
  className,
  textareaClassName,
  labelIcon,
  labelSuffix,
  maxLength,
}: FormTextareaProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const currentLength = (value ?? '').length;

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      labelIcon={labelIcon}
      labelSuffix={labelSuffix}
      className={className}
    >
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        className={`border-slate-600 bg-slate-700/50 resize-none ${textareaClassName || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        required={required}
        disabled={disabled}
      />
      {maxLength && (
        <p className="mt-1 text-xs text-slate-500 text-right">
          {currentLength}/{maxLength}
        </p>
      )}
    </FormField>
  );
}
