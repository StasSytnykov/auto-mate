import { z } from 'zod';

export const vehicleFormSchema = z.object({
  vin: z
    .string()
    .length(17, 'VIN код повинен містити рівно 17 символів')
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/i,
      'VIN код містить недопустимі символи (I, O, Q не дозволені)'
    ),
  makeModel: z.string().optional(),
  year: z
    .number()
    .min(1980, 'Рік випуску має бути не раніше 1980')
    .max(new Date().getFullYear() + 1, 'Невірний рік випуску')
    .optional(),
  mileage: z
    .number()
    .min(0, 'Пробіг не може бути від\'ємним')
    .max(2000000, 'Занадто великий пробіг')
    .optional(),
  price: z
    .number()
    .min(0, 'Ціна не може бути від\'ємною')
    .max(10000000, 'Занадто висока ціна')
    .optional(),
  sellerDescription: z.string().max(5000, 'Опис занадто довгий').optional(),
  userQuestion: z.string().max(1000, 'Питання занадто довге').optional(),
});

export type VehicleFormSchema = z.infer<typeof vehicleFormSchema>;

