import { NextRequest, NextResponse } from 'next/server';
import { vehicleFormSchema } from '@/features/vehicle-analysis/model/schemas';
import { decodeVIN } from '@/features/vehicle-analysis/api/decode-vin';
import { analyzeVehicle } from '@/features/vehicle-analysis/api/analyze-vehicle';
import { AnalysisResult } from '@/features/vehicle-analysis/model/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = vehicleFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Decode VIN
    let decodedVIN = null;
    try {
      decodedVIN = await decodeVIN(formData.vin);
    } catch (error) {
      console.error('VIN decode error:', error);
      // Continue without decoded VIN data
    }

    // Analyze vehicle with AI
    const analysis = await analyzeVehicle(formData, decodedVIN);

    const result: AnalysisResult = {
      decodedVIN,
      analysis,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

