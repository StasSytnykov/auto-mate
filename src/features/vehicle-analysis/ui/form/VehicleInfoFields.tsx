'use client';

import * as React from 'react';
import { FormInput } from '@/shared/ui/form';

interface VehicleInfoFieldsProps {
  makeModel: string;
  year: number | undefined;
  onMakeModelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  yearError?: string;
  disabled?: boolean;
}

export function VehicleInfoFields({
  makeModel,
  year,
  onMakeModelChange,
  onYearChange,
  yearError,
  disabled,
}: VehicleInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput
        id="makeModel"
        name="makeModel"
        label="Марка та Модель"
        value={makeModel}
        onChange={onMakeModelChange}
        placeholder="напр. Volkswagen Passat"
        disabled={disabled}
      />
      <FormInput
        id="year"
        name="year"
        label="Рік випуску"
        type="number"
        value={year}
        onChange={onYearChange}
        placeholder="напр. 2018"
        min={1980}
        max={new Date().getFullYear() + 1}
        error={yearError}
        disabled={disabled}
      />
    </div>
  );
}
