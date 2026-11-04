import { NextResponse } from 'next/server';
import {
  parsePlaylistId,
  searchYouTubePlaylists,
  fetchPlaylistDetails
} from '../../../../src/lib/youtube-scraper';
import { REAL_YOUTUBE_PLAYLISTS } from '../../../../src/data/real-playlists';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPlaylistId = searchParams.get('playlistId') || searchParams.get('list') || searchParams.get('id');
  const query = searchParams.get('query') || searchParams.get('q');
  const offsetParam = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0);
  const limitParam = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '300', 10) || 300));

  // حماية ضد الاستعلامات العشوائية أو الطويلة جداً
  if (rawPlaylistId && rawPlaylistId.length > 200) {
    return NextResponse.json({ error: 'معرف قائمة التشغيل طويل جداً' }, { status: 400 });
  }
  if (query && query.length > 150) {
    return NextResponse.json({ error: 'استعلام البحث طويل جداً' }, { status: 400 });
  }

  let playlistId = rawPlaylistId ? parsePlaylistId(rawPlaylistId) : null;

  try {
    // إذا لم يتوفر المعرف الصريح وتوفر استعلام بحث
    if (!playlistId && query) {
      const searchResults = await searchYouTubePlaylists(query, { limit: 1 });
      if (searchResults.length > 0) {
        playlistId = searchResults[0].playlistId;
      }
    }

    if (!playlistId) {
      return NextResponse.json(
        { error: 'يرجى تقديم معرف قائمة تشغيل صالح (playlistId) أو استعلام بحث (query).' },
        { status: 400 }
      );
    }

    const validPlaylistId: string = playlistId;

    // التحقق من وجود القائمة في الكاش المحلي أولاً للسرعة القصوى (مطابقة دقيقة أو غير حساسة للأحرف)
    const cachedEntry =
      (REAL_YOUTUBE_PLAYLISTS as Record<string, any>)?.[validPlaylistId] ||
      Object.entries(REAL_YOUTUBE_PLAYLISTS as Record<string, any>).find(
        ([k]) => k.toLowerCase() === validPlaylistId.toLowerCase()
      )?.[1];

    let result = cachedEntry;

    // إذا لم تكن موجودة أو كانت غير مكتملة، نجلبها مباشرة من يوتيوب مع استكمال صفحات التتابع (Continuation Tokens)
    if (!result || (result.videoCount && result.videos?.length < result.videoCount && result.hasMore)) {
      result = await fetchPlaylistDetails(validPlaylistId, {
        fetchAll: true,
        maxVideos: 500
      });
    }

    // تطبيق التجزئة (Pagination / Slicing) إذا تم تحديدها
    const allVideos = result.videos || [];
    const slicedVideos =
      offsetParam > 0 || limitParam < allVideos.length
        ? allVideos.slice(offsetParam, offsetParam + limitParam)
        : allVideos;

    const responsePayload = {
      success: true,
      playlistId: result.playlistId || validPlaylistId,
      title: result.title,
      channelTitle: result.channelTitle,
      videoCount: result.videoCount || allVideos.length,
      thumbnail: result.thumbnail,
      videos: slicedVideos,
      total: allVideos.length,
      offset: offsetParam,
      limit: limitParam,
      hasMore: offsetParam + slicedVideos.length < allVideos.length
    };

    return new NextResponse(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // كاش Edge لمدة 24 ساعة مع إمكانية التحديث في الخلفية (stale-while-revalidate لمدة أسبوع)
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    });
  } catch (err: any) {
    console.error('YouTube Playlist API Error:', err);
    return NextResponse.json(
      {
        error: err.message || 'حدث خطأ أثناء جلب قائمة التشغيل من يوتيوب',
        playlistId
      },
      { status: 500 }
    );
  }
}
