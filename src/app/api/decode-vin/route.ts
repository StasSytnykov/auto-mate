import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { decodeVIN } from '@/features/vehicle-analysis/api/decode-vin';

const vinSchema = z.object({
  vin: z
    .string()
    .length(17, 'VIN код повинен містити рівно 17 символів')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'VIN код містить недопустимі символи'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate VIN
    const validationResult = vinSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { vin } = validationResult.data;

    // Decode VIN
    const decodedVIN = await decodeVIN(vin);

    return NextResponse.json({
      decodedVIN,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('VIN decode error:', error);

    return NextResponse.json(
      {
        error: 'VIN decode failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        decodedVIN: null,
      },
      { status: 200 } // Return 200 so the UI can continue to streaming
    );
  }
}
