import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { feedbackSchema } from '@/features/vehicle-analysis/model/schemas';

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedis ? Redis.fromEnv() : null;

const rateLimit = hasRedis
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      prefix: 'rateLimit:feedback',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (rateLimit) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
      const { success } = await rateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: 'Забагато запитів. Спробуйте пізніше.' },
          { status: 429 }
        );
      }
    }

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
        message: process.env.NODE_ENV === 'production' ? 'Сталася помилка' : (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
