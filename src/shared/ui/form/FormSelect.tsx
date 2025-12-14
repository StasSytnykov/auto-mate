'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { FormField } from './FormField';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelIcon?: React.ReactNode;
  labelSuffix?: React.ReactNode;
}

export function FormSelect({
  id,
  name,
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Оберіть...',
  required,
  disabled,
  error,
  hint,
  className,
  labelIcon,
  labelSuffix,
}: FormSelectProps) {
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
      <Select value={value || ''} onValueChange={onValueChange} disabled={disabled} name={name}>
        <SelectTrigger id={id} aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
