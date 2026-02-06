import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { feedbackSchema } from '@/features/vehicle-analysis/model/schemas';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = feedbackSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { rating, comment, vehicle } = validationResult.data;

    const entry = {
      id: crypto.randomUUID(),
      rating,
      comment: comment || undefined,
      vehicle: vehicle || undefined,
      createdAt: new Date().toISOString(),
    };

    if (redis) {
      await redis.lpush('feedback:all', JSON.stringify(entry));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
