'use client';

import { useState, useCallback } from 'react';
import { vehicleFormSchema } from '../../model/schemas';
import { VehicleFormData, FuelType } from '../../model/types';

interface UseVehicleFormOptions {
  onSubmit: (data: VehicleFormData) => Promise<void>;
}

interface UseVehicleFormReturn {
  formData: Partial<VehicleFormData>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFormFields: (fields: Partial<VehicleFormData>) => void;
}

const INITIAL_FORM_DATA: Partial<VehicleFormData> = {
  vin: '',
  makeModel: '',
  year: undefined,
  mileage: undefined,
  price: undefined,
  fuelType: undefined,
  engineCapacity: undefined,
  sellerDescription: '',
  userQuestion: '',
};

export function useVehicleForm({ onSubmit }: UseVehicleFormOptions): UseVehicleFormReturn {
  const [formData, setFormData] = useState<Partial<VehicleFormData>>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;

      let parsedValue: string | number | undefined = value;

      if (type === 'number' && value !== '') {
        parsedValue = parseFloat(value);
      } else if (type === 'number' && value === '') {
        parsedValue = undefined;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));

      clearFieldError(name);
    },
    [clearFieldError]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      clearFieldError(name);
    },
    [clearFieldError]
  );

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : (value as FuelType),
      }));

      clearFieldError(name);
    },
    [clearFieldError]
  );

  const setFormFields = useCallback((fields: Partial<VehicleFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev };
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== '' && value !== 'Невідомо' && value !== 0) {
          const currentValue = updated[key as keyof VehicleFormData];
          if (!currentValue && currentValue !== 0) {
            (updated as Record<string, unknown>)[key] = value;
          }
        }
      }
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = vehicleFormSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      await onSubmit(result.data);
    },
    [formData, onSubmit]
  );

  return {
    formData,
    errors,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleSubmit,
    setFormFields,
  };
}
