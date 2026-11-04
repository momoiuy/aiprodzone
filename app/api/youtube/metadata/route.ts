import { NextResponse } from 'next/server';
import { parseYouTubeUrl } from '../../../../src/lib/youtube';

const CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('url') || searchParams.get('videoId') || '';

  return handleYouTubeMetadata(input);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = body.url || body.videoId || '';
    return handleYouTubeMetadata(input);
  } catch {
    return NextResponse.json({ error: 'صيغة طلب غير صالحة' }, { status: 400 });
  }
}

async function handleYouTubeMetadata(input: string) {
  if (!input || typeof input !== 'string' || input.length > 500) {
    return NextResponse.json(
      { error: 'رابط يوتيوب غير صالح أو لم يتم تقديم معرّف' },
      { status: 400 }
    );
  }

  const videoId = parseYouTubeUrl(input);

  // تحقق صارم من سلامة معرّف الفيديو (11 حرفاً أبجدياً رقمياً مع شرطة وشرطة سفلية)
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json(
      { error: 'رابط يوتيوب غير صالح أو لم يتم العثور على معرّف فيديو صالح' },
      { status: 400 }
    );
  }

  const hqThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AIProdZone/1.0',
        Accept: 'application/json'
      },
      next: { revalidate: 86400 }
    });

    if (response.ok) {
      const data = await response.json();
      return new NextResponse(
        JSON.stringify({
          videoId,
          title: data.title || '',
          author_name: data.author_name || '',
          author_url: data.author_url || '',
          thumbnail: data.thumbnail_url || hqThumbnail,
          thumbnailHq: hqThumbnail,
          originalThumbnail: data.thumbnail_url || hqThumbnail,
          provider_name: data.provider_name || 'YouTube'
        }),
        {
          status: 200,
          headers: CACHE_HEADERS
        }
      );
    }
  } catch (error) {
    console.warn('YouTube oEmbed fetch error for videoId:', videoId, error);
  }

  // في حال تعذر الاتصال بـ oEmbed، نُرجع معرّف الفيديو والصور المصغرة مع الترويسات المحصنة
  return new NextResponse(
    JSON.stringify({
      videoId,
      title: '',
      author_name: '',
      thumbnail: hqThumbnail,
      thumbnailHq: hqThumbnail
    }),
    {
      status: 200,
      headers: CACHE_HEADERS
    }
  );
}
