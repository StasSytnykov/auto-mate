'use client';

import * as React from 'react';
import { FormInput, FormSelect, SelectOption } from '@/shared/ui/form';
import { FuelType } from '../../model/types';

const FUEL_TYPE_OPTIONS: SelectOption[] = [
  { value: 'petrol', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'gas', label: 'Газ/Бензин' },
  { value: 'hybrid', label: 'Гібрид' },
  { value: 'electric', label: 'Електро' },
];

interface EngineFieldsProps {
  fuelType: FuelType | undefined;
  engineCapacity: number | undefined;
  onFuelTypeChange: (value: FuelType) => void;
  onEngineCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fuelTypeError?: string;
  engineCapacityError?: string;
  disabled?: boolean;
}

export function EngineFields({
  fuelType,
  engineCapacity,
  onFuelTypeChange,
  onEngineCapacityChange,
  fuelTypeError,
  engineCapacityError,
  disabled,
}: EngineFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormSelect
        id="fuelType"
        name="fuelType"
        label="Тип палива"
        value={fuelType}
        onValueChange={(value) => onFuelTypeChange(value as FuelType)}
        options={FUEL_TYPE_OPTIONS}
        placeholder="Оберіть тип палива"
        error={fuelTypeError}
        disabled={disabled}
      />
      <FormInput
        id="engineCapacity"
        name="engineCapacity"
        label="Об'єм двигуна (л)"
        type="number"
        value={engineCapacity}
        onChange={onEngineCapacityChange}
        placeholder="напр. 2.0"
        min={0.5}
        max={10}
        step={0.1}
        error={engineCapacityError}
        disabled={disabled}
      />
    </div>
  );
}
