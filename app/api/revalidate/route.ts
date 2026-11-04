import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const EXPECTED_SECRET = process.env.REVALIDATE_SECRET || 'aiprodzone-secret-2026';

function isAuthorized(request: Request): boolean {
  try {
    const url = new URL(request.url);
    const querySecret = url.searchParams.get('secret');
    const headerSecret = request.headers.get('x-revalidate-secret');
    const authHeader = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();

    const provided = querySecret || headerSecret || authHeader;
    return Boolean(provided && provided === EXPECTED_SECRET);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { revalidated: false, error: 'Unauthorized: رمز التحقق السري غير صالح أو مفقود' },
      { status: 401 }
    );
  }

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { revalidated: false, error: 'Unauthorized: رمز التحقق السري غير صالح أو مفقود' },
      { status: 401 }
    );
  }

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'page');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
