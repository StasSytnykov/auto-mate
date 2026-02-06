import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { decodeVIN } from '@/features/vehicle-analysis/api/decode-vin';

const vinSchema = z.object({
  vin: z
    .string()
    .length(17, 'VIN код повинен містити рівно 17 символів')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'VIN код містить недопустимі символи'),
});

const rateLimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(30, '1 h'),
        prefix: 'ratelimit:decode-vin',
      })
    : null;

export async function POST(request: NextRequest) {
  try {
    if (rateLimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
      const { success } = await rateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: 'Забагато запитів. Спробуйте пізніше.', decodedVIN: null },
          { status: 429 }
        );
      }
    }

    const body = await request.json();

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
        message: process.env.NODE_ENV === 'production' ? 'Не вдалося декодувати VIN' : (error instanceof Error ? error.message : 'Unknown error'),
        decodedVIN: null,
      },
      { status: 200 } // Return 200 so the UI can continue to streaming
    );
  }
}







