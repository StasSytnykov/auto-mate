'use client';

import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { VehicleFormData, FuelType } from '../model/types';
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

interface VehicleFormProps {
  onSubmit: (formData: VehicleFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function VehicleForm({ onSubmit, isLoading, error: externalError }: VehicleFormProps) {
  const { formData, errors, handleInputChange, handleTextareaChange, handleSelectChange, handleSubmit } =
    useVehicleForm({ onSubmit });

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
