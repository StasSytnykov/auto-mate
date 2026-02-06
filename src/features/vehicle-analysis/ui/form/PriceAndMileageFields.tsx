'use client';

import * as React from 'react';
import { FormInput } from '@/shared/ui/form';

interface PriceAndMileageFieldsProps {
  mileage: number | undefined;
  price: number | undefined;
  onMileageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mileageError?: string;
  priceError?: string;
  disabled?: boolean;
}

export function PriceAndMileageFields({
  mileage,
  price,
  onMileageChange,
  onPriceChange,
  mileageError,
  priceError,
  disabled,
}: PriceAndMileageFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput
        id="mileage"
        name="mileage"
        label="Пробіг (тис. км)"
        type="number"
        value={mileage}
        onChange={onMileageChange}
        placeholder="напр. 180"
        min={0}
        max={2000}
        step={1}
        hint="180 = 180 000 км"
        error={mileageError}
        disabled={disabled}
      />
      <FormInput
        id="price"
        name="price"
        label="Ціна ($)"
        type="number"
        value={price}
        onChange={onPriceChange}
        placeholder="напр. 14500"
        min={0}
        error={priceError}
        disabled={disabled}
      />
    </div>
  );
}
