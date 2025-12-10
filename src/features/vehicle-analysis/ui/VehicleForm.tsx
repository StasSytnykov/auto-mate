'use client';

import { useState } from 'react';
import { Car, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { vehicleFormSchema } from '../model/schemas';
import { VehicleFormData, AnalysisResult } from '../model/types';

interface VehicleFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
  isLoading: boolean;
}

export function VehicleForm({
  onAnalysisComplete,
  onAnalysisStart,
  isLoading,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<VehicleFormData>>({
    vin: '',
    makeModel: '',
    year: undefined,
    mileage: undefined,
    price: undefined,
    sellerDescription: '',
    userQuestion: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
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

    onAnalysisStart();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      onAnalysisComplete(data);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({
        submit:
          error instanceof Error ? error.message : 'Помилка при аналізі авто',
      });
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* VIN Code - Required */}
          <div className="space-y-2">
            <Label htmlFor="vin" className="text-slate-300">
              VIN Код <span className="text-red-400">*</span>
            </Label>
            <Input
              id="vin"
              name="vin"
              placeholder="ВВЕДІТЬ 17-ЗНАЧНИЙ VIN"
              value={formData.vin || ''}
              onChange={handleChange}
              maxLength={17}
              className="border-slate-600 bg-slate-700/50 font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
              aria-invalid={!!errors.vin}
            />
            {errors.vin && (
              <p className="text-sm text-red-400">{errors.vin}</p>
            )}
          </div>

          {/* Make & Model + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="makeModel" className="text-slate-300">
                Марка та Модель
              </Label>
              <Input
                id="makeModel"
                name="makeModel"
                placeholder="напр. Volkswagen Passat"
                value={formData.makeModel || ''}
                onChange={handleChange}
                className="border-slate-600 bg-slate-700/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-slate-300">
                Рік випуску
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="напр. 2018"
                value={formData.year || ''}
                onChange={handleChange}
                min={1980}
                max={new Date().getFullYear() + 1}
                className="border-slate-600 bg-slate-700/50"
              />
              {errors.year && (
                <p className="text-sm text-red-400">{errors.year}</p>
              )}
            </div>
          </div>

          {/* Mileage + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-slate-300">
                Пробіг (км)
              </Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                placeholder="напр. 180000"
                value={formData.mileage || ''}
                onChange={handleChange}
                min={0}
                className="border-slate-600 bg-slate-700/50"
              />
              {errors.mileage && (
                <p className="text-sm text-red-400">{errors.mileage}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-300">
                Ціна ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="напр. 14500"
                value={formData.price || ''}
                onChange={handleChange}
                min={0}
                className="border-slate-600 bg-slate-700/50"
              />
              {errors.price && (
                <p className="text-sm text-red-400">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Seller Description */}
          <div className="space-y-2">
            <Label htmlFor="sellerDescription" className="text-slate-300">
              Опис продавця / Деталі стану{' '}
              <span className="text-slate-500">
                (скопіюйте опис з оголошення сюди)
              </span>
            </Label>
            <Textarea
              id="sellerDescription"
              name="sellerDescription"
              placeholder="Продавець пише: не бита, замінено масло, є нюанс по крилу..."
              value={formData.sellerDescription || ''}
              onChange={handleChange}
              rows={4}
              className="border-slate-600 bg-slate-700/50 resize-none"
            />
            {errors.sellerDescription && (
              <p className="text-sm text-red-400">{errors.sellerDescription}</p>
            )}
          </div>

          {/* User Question */}
          <div className="space-y-2">
            <Label
              htmlFor="userQuestion"
              className="flex items-center gap-2 text-slate-300"
            >
              <HelpCircle className="h-4 w-4 text-blue-400" />
              Ваше запитання до AI експерта
            </Label>
            <Textarea
              id="userQuestion"
              name="userQuestion"
              placeholder="напр. Чи надійний тут автомат? Чи дорога вона в обслуговуванні?"
              value={formData.userQuestion || ''}
              onChange={handleChange}
              rows={2}
              className="border-slate-600 bg-slate-700/50 resize-none"
            />
            {errors.userQuestion && (
              <p className="text-sm text-red-400">{errors.userQuestion}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Аналізую...
              </>
            ) : (
              <>
                <Car className="mr-2 h-5 w-5" />
                Аналізувати авто
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

