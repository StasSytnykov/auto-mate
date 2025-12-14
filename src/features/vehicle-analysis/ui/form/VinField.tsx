'use client';

import * as React from 'react';
import { FormInput } from '@/shared/ui/form';

interface VinFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export function VinField({ value, onChange, error, disabled }: VinFieldProps) {
  return (
    <FormInput
      id="vin"
      name="vin"
      label="VIN Код"
      value={value}
      onChange={onChange}
      placeholder="ВВЕДІТЬ 17-ЗНАЧНИЙ VIN"
      required
      maxLength={17}
      error={error}
      disabled={disabled}
      inputClassName="font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
    />
  );
}
