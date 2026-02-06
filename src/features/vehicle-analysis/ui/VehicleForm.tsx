'use client';

import { useEffect, useRef } from 'react';
import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { VehicleFormData, FuelType, DecodedVIN } from '../model/types';
import {
  VinField,
  VehicleInfoFields,
  PriceAndMileageFields,
  EngineFields,
  DescriptionFields,
  SubmitButton,
  FormError,
  useVehicleForm,
} from './form';

function mapDecodedFuelType(fuelType: string): FuelType | undefined {
  const lower = fuelType.toLowerCase();
  if (lower.includes('diesel')) return 'diesel';
  if (lower.includes('electric')) return 'electric';
  if (lower.includes('hybrid')) return 'hybrid';
  if (lower.includes('gas') || lower.includes('lpg') || lower.includes('cng')) return 'gas';
  if (lower.includes('gasoline') || lower.includes('petrol') || lower.includes('benzin')) return 'petrol';
  return undefined;
}

interface VehicleFormProps {
  onSubmit: (formData: VehicleFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  decodedVIN?: DecodedVIN | null;
}

export function VehicleForm({ onSubmit, isLoading, error: externalError, decodedVIN }: VehicleFormProps) {
  const { formData, errors, handleInputChange, handleTextareaChange, handleSelectChange, handleSubmit, setFormFields } =
    useVehicleForm({ onSubmit });

  const appliedVINRef = useRef<string | null>(null);

  useEffect(() => {
    if (!decodedVIN) return;

    const vinKey = `${decodedVIN.make}-${decodedVIN.model}-${decodedVIN.year}`;
    if (appliedVINRef.current === vinKey) return;
    appliedVINRef.current = vinKey;

    const fields: Partial<VehicleFormData> = {};

    if (decodedVIN.make && decodedVIN.make !== 'Невідомо') {
      const model = decodedVIN.model !== 'Невідомо' ? ` ${decodedVIN.model}` : '';
      fields.makeModel = `${decodedVIN.make}${model}`;
    }

    if (decodedVIN.year && decodedVIN.year > 0) {
      fields.year = decodedVIN.year;
    }

    if (decodedVIN.fuelType && decodedVIN.fuelType !== 'Невідомо') {
      fields.fuelType = mapDecodedFuelType(decodedVIN.fuelType);
    }

    if (decodedVIN.engineDisplacement && decodedVIN.engineDisplacement !== 'Невідомо') {
      const displacement = parseFloat(decodedVIN.engineDisplacement.replace('L', ''));
      if (!isNaN(displacement) && displacement > 0) {
        fields.engineCapacity = displacement;
      }
    }

    setFormFields(fields);
  }, [decodedVIN, setFormFields]);

  const submitError = externalError || errors.submit;

  return (
    <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Car className="h-5 w-5 text-blue-400" />
          </div>
          Дані про авто
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <VinField value={formData.vin || ''} onChange={handleInputChange} error={errors.vin} disabled={isLoading} />

          <VehicleInfoFields
            makeModel={formData.makeModel || ''}
            year={formData.year}
            onMakeModelChange={handleInputChange}
            onYearChange={handleInputChange}
            yearError={errors.year}
            disabled={isLoading}
          />

          <PriceAndMileageFields
            mileage={formData.mileage}
            price={formData.price}
            onMileageChange={handleInputChange}
            onPriceChange={handleInputChange}
            mileageError={errors.mileage}
            priceError={errors.price}
            disabled={isLoading}
          />

          <EngineFields
            fuelType={formData.fuelType as FuelType | undefined}
            engineCapacity={formData.engineCapacity}
            onFuelTypeChange={(value) => handleSelectChange('fuelType', value)}
            onEngineCapacityChange={handleInputChange}
            fuelTypeError={errors.fuelType}
            engineCapacityError={errors.engineCapacity}
            disabled={isLoading}
          />

          <DescriptionFields
            sellerDescription={formData.sellerDescription || ''}
            userQuestion={formData.userQuestion || ''}
            onSellerDescriptionChange={handleTextareaChange}
            onUserQuestionChange={handleTextareaChange}
            sellerDescriptionError={errors.sellerDescription}
            userQuestionError={errors.userQuestion}
            disabled={isLoading}
          />

          <FormError error={submitError} />

          <SubmitButton isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
}
