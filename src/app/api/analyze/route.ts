import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { vehicleFormSchema } from '@/features/vehicle-analysis/model/schemas';
import { SYSTEM_INSTRUCTION, buildPrompt } from '@/features/vehicle-analysis/api/analyze-vehicle';
import { DecodedVIN } from '@/features/vehicle-analysis/model/types';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const rateLimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '24 h'),
        analytics: true,
      })
    : null;

export async function POST(request: NextRequest) {
  try {
    if (rateLimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
      const { success, reset } = await rateLimit.limit(ip);

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

    }

    const body = await request.json();

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
    const decodedVIN: DecodedVIN | null = body.decodedVIN || null;

    const prompt = buildPrompt(formData, decodedVIN);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_INSTRUCTION,
      prompt: prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Analysis error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Сталася помилка при аналізі' : (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
