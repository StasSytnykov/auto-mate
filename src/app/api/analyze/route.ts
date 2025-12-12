import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { vehicleFormSchema } from '@/features/vehicle-analysis/model/schemas';
import { decodeVIN } from '@/features/vehicle-analysis/api/decode-vin';
import { analyzeVehicle } from '@/features/vehicle-analysis/api/analyze-vehicle';
import { AnalysisResult } from '@/features/vehicle-analysis/model/types';

// Rate limiting: 5 requests per IP per 24 hours
// Only initialize if Redis credentials are available (production)
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '24 h'),
        analytics: true,
      })
    : null;

export async function POST(request: NextRequest) {
  // Track rate limit remaining for response headers
  let rateLimitRemaining: number | null = null;

  try {
    // Apply rate limiting if configured
    if (ratelimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
      const { success, remaining, reset } = await ratelimit.limit(ip);

      if (!success) {
        const resetDate = new Date(reset);
        return NextResponse.json(
          {
            error: 'Ліміт вичерпано',
            message: `Ви використали всі безкоштовні аналізи на сьогодні (5/день). Спробуйте після ${resetDate.toLocaleTimeString(
              'uk-UA'
            )}.`,
            remaining: 0,
            resetAt: reset,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }

      rateLimitRemaining = remaining;
    }

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

    // Include rate limit info in response headers if available
    const headers: Record<string, string> = {};
    if (rateLimitRemaining !== null) {
      headers['X-RateLimit-Remaining'] = rateLimitRemaining.toString();
    }

    return NextResponse.json(result, { headers });
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
