'use client';

import * as React from 'react';
import { Input } from '@/shared/ui/input';
import { FormField } from './FormField';

export interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  labelIcon?: React.ReactNode;
  labelSuffix?: React.ReactNode;
}

export function FormInput({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  error,
  hint,
  min,
  max,
  step,
  maxLength,
  className,
  inputClassName,
  labelIcon,
  labelSuffix,
}: FormInputProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

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
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        className={`border-slate-600 bg-slate-700/50 ${inputClassName || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        required={required}
        disabled={disabled}
      />
    </FormField>
  );
}
