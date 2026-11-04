/**
 * محرك استخراج قوائم التشغيل والدروس الحقيقية من يوتيوب (Zero-Hallucination Engine)
 * يستخرج معرفات القوائم الحقيقية وعناوين الفيديوهات الأصلية ومددها بدقة 100% مباشرة من يوتيوب.
 */

// ضبط أولوية الاتصال بـ IPv4 في بيئة Node لتجنب انقطاع المقابس في Windows
if (typeof process !== 'undefined' && process.versions?.node) {
  try {
    const dns = await import('node' + ':dns');
    if (dns?.setDefaultResultOrder) {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch {
    // تجاوز في بيئات التشغيل الأخرى
  }
}

const YOUTUBE_DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const DEFAULT_FETCH_HEADERS = {
  'User-Agent': YOUTUBE_DESKTOP_UA,
  'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  Cookie: 'CONSENT=YES+cb.20210328-17-p0.en+FX+478; SOCS=CAESEwgDEgk0ODEzNzk5NDIaAmVuIAEaBgiA_LyaBg',
  Connection: 'close'
};

/**
 * استخراج معرف قائمة التشغيل الحقيقي من رابط أو نص
 * @param {string} input
 * @returns {string|null}
 */
export function parsePlaylistId(input) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const listParam = parsed.searchParams.get('list');
    if (listParam && /^([a-zA-Z0-9_-]{10,})$/.test(listParam)) {
      return listParam;
    }
  } catch {
    // الانتقال للتحليل بالنصوص النمطية
  }

  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]{10,})/i);
  if (match) return match[1];

  if (/^(PL|UU|FL|OLAK5uy_)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * استخراج كائن ytInitialData من نص صفحة يوتيوب
 * @param {string} html
 * @returns {Object|null}
 */
export function extractYtInitialData(html) {
  if (!html || typeof html !== 'string') return null;

  // المحاولات المتعددة لتفادي التغيرات في بنية كود الصفحة
  const patterns = [
    /var ytInitialData\s*=\s*({.+?});<\/script>/s,
    /ytInitialData\s*=\s*({.+?});/s,
    /window\["ytInitialData"\]\s*=\s*({.+?});/s
  ];

  for (const regex of patterns) {
    const match = html.match(regex);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // الاستمرار للمطابقة التالية
      }
    }
  }

  return null;
}

/**
 * استخراج مفتاح YouTube InnerTube API وإصدار العميل من صفحة الويب
 * @param {string} html
 * @returns {{ apiKey: string|null, clientVersion: string }}
 */
export function extractInnertubeConfig(html) {
  const apiKeyMatch =
    html.match(/"INNERTUBE_API_KEY":"([^"]+)"/) ||
    html.match(/"innertubeApiKey":"([^"]+)"/);

  const clientVersionMatch =
    html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/) ||
    html.match(/"clientVersion":"([^"]+)"/);

  return {
    apiKey: apiKeyMatch?.[1] || null,
    clientVersion: clientVersionMatch?.[1] || '2.20261030.02.00'
  };
}

/**
 * البحث في يوتيوب عن قوائم التشغيل المطابقة لاسم القناة واسم الدورة
 * @param {string} query
 * @param {{ limit?: number }} options
 * @returns {Promise<Array<{ playlistId: string, title: string, channelTitle: string, videoCount: number|string, thumbnail: string }>>}
 */
export async function searchYouTubePlaylists(query, { limit = 5 } = {}) {
  if (!query || typeof query !== 'string') return [];

  // sp=EgIQAw%253D%253D يضمن تصفية نتائج البحث في يوتيوب لتقتصر على قوائم التشغيل فقط (Type: Playlist)
  const encodedQuery = encodeURIComponent(query.trim());
  const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}&sp=EgIQAw%253D%253D`;

  const response = await fetch(searchUrl, {
    headers: DEFAULT_FETCH_HEADERS,
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`فشل الاتصال ببحث يوتيوب: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const ytData = extractYtInitialData(html);
  if (!ytData) {
    throw new Error('تعذر استخراج بيانات نتائج البحث من يوتيوب (ytInitialData missing)');
  }

  const results = [];
  const contents =
    ytData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents || [];

  for (const item of contents) {
    // 1. النمط الكلاسيكي: playlistRenderer
    if (item.playlistRenderer) {
      const pr = item.playlistRenderer;
      const playlistId = pr.playlistId;
      const title = pr.title?.simpleText || pr.title?.runs?.[0]?.text || '';
      const channelTitle = pr.longBylineText?.runs?.[0]?.text || pr.shortBylineText?.runs?.[0]?.text || '';
      const videoCount = pr.videoCount || pr.thumbnailRenderer?.playlistVideoThumbnailRenderer?.videoCount || '';
      const thumb =
        pr.thumbnails?.[0]?.thumbnails?.slice(-1)?.[0]?.url ||
        `https://i.ytimg.com/vi/${pr.navigationEndpoint?.watchEndpoint?.videoId || ''}/hqdefault.jpg`;

      if (playlistId && title) {
        results.push({
          playlistId,
          title,
          channelTitle,
          videoCount,
          thumbnail: thumb
        });
      }
    }
    // 2. النمط الحديث: lockupViewModel
    else if (item.lockupViewModel) {
      const lvm = item.lockupViewModel;
      const onTap = lvm.rendererContext?.commandContext?.onTap?.innertubeCommand;
      const playlistId =
        onTap?.watchEndpoint?.playlistId ||
        lvm.contentId ||
        null;

      const title =
        lvm.metadata?.lockupMetadataViewModel?.title?.content ||
        lvm.rendererContext?.accessibilityContext?.label ||
        '';

      const channelTitle =
        lvm.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]
          ?.metadataParts?.[0]?.text?.content || '';

      const thumbSources = lvm.contentImage?.thumbnailViewModel?.image?.sources || [];
      const thumbnail = thumbSources.slice(-1)?.[0]?.url || '';

      if (playlistId && (playlistId.startsWith('PL') || playlistId.startsWith('UU') || playlistId.startsWith('OLAK5uy_'))) {
        results.push({
          playlistId,
          title,
          channelTitle,
          videoCount: '',
          thumbnail
        });
      }
    }

    if (results.length >= limit) break;
  }

  return results;
}

/**
 * تحليل عنصر فيديو فردي واستخراج بياناته الموحدة
 * @param {Object} rawItem
 * @param {number} fallbackIndex
 * @returns {{ index: number, videoId: string, title: string, duration: string, thumbnail: string }|null}
 */
export function parsePlaylistItem(rawItem, fallbackIndex = 1) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  // 1. الكلاسيكي: playlistVideoRenderer
  if (rawItem.playlistVideoRenderer) {
    const vr = rawItem.playlistVideoRenderer;
    const videoId = vr.videoId;
    if (!videoId) return null;

    const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || `الدرس ${fallbackIndex}`;
    let duration = vr.lengthText?.simpleText || vr.lengthText?.runs?.[0]?.text || '';
    if (!duration && Array.isArray(vr.thumbnailOverlays)) {
      for (const ov of vr.thumbnailOverlays) {
        const timeText =
          ov?.thumbnailOverlayTimeStatusRenderer?.text?.simpleText ||
          ov?.thumbnailOverlayTimeStatusRenderer?.text?.runs?.[0]?.text;
        if (timeText && /\d+:\d+/.test(timeText)) {
          duration = timeText;
          break;
        }
      }
    }
    const indexVal = Number(vr.index?.simpleText || vr.index?.runs?.[0]?.text || fallbackIndex);

    return {
      index: Number.isFinite(indexVal) && indexVal > 0 ? indexVal : fallbackIndex,
      videoId,
      title: title.trim(),
      duration: duration.trim(),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // 2. الحديث: lockupViewModel
  if (rawItem.lockupViewModel) {
    const lvm = rawItem.lockupViewModel;
    const videoId =
      lvm.contentId ||
      lvm.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;

    if (!videoId || videoId.length !== 11) return null;

    const meta = lvm.metadata?.lockupMetadataViewModel;
    const rawTitle = meta?.title?.content || lvm.rendererContext?.accessibilityContext?.label || `الدرس ${fallbackIndex}`;
    
    // إزالة المدة إذا كانت مدمجة في نهاية accessibility label
    const cleanTitle = rawTitle.replace(/\s+\d+\s+دقيقة.*/, '').trim();

    // استخراج المدة من overlay badges
    const overlays = lvm.contentImage?.thumbnailViewModel?.overlays || [];
    let duration = '';
    for (const ov of overlays) {
      const badges = ov?.thumbnailBottomOverlayViewModel?.badges || [];
      for (const b of badges) {
        const text = b?.thumbnailBadgeViewModel?.text;
        if (text && /\d+:\d+/.test(text)) {
          duration = text.trim();
          break;
        }
      }
      if (duration) break;
    }

    if (!duration) {
      const a11y = lvm.rendererContext?.accessibilityContext?.label || '';
      const matchA11y = a11y.match(/(\d+:\d+(?::\d+)?)/);
      if (matchA11y) {
        duration = matchA11y[1].trim();
      }
    }

    return {
      index: fallbackIndex,
      videoId,
      title: cleanTitle,
      duration: duration.trim(),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  return null;
}

/**
 * استخراج رمز المتابعة (Continuation Token) لجلب الدفعات التالية للقوائم التي تضم أكثر من 100 فيديو
 * @param {Array<Object>} items
 * @returns {string|null}
 */
export function extractContinuationToken(items) {
  if (!Array.isArray(items)) return null;

  for (const it of items) {
    // 1. الحديث
    if (it.continuationItemViewModel) {
      const cmd =
        it.continuationItemViewModel.continuationCommand?.continuationCommand ||
        it.continuationItemViewModel.continuationCommand?.innertubeCommand?.continuationCommand;
      if (cmd?.token) return cmd.token;
    }
    // 2. الكلاسيكي
    if (it.continuationItemRenderer) {
      const token = it.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token;
      if (token) return token;
    }
  }

  return null;
}

/**
 * جلب تفاصيل قائمة التشغيل وجميع الفيديوهات المرتبة مباشرة من يوتيوب
 * @param {string} playlistIdOrUrl
 * @param {{ fetchAll?: boolean, maxVideos?: number }} options
 * @returns {Promise<{ playlistId: string, title: string, channelTitle: string, videoCount: number, thumbnail: string, videos: Array<Object>, hasMore: boolean }>}
 */
export async function fetchPlaylistDetails(playlistIdOrUrl, { fetchAll = true, maxVideos = 500 } = {}) {
  const playlistId = parsePlaylistId(playlistIdOrUrl);
  if (!playlistId) {
    throw new Error(`معرف قائمة التشغيل غير صالح أو مفقود: ${playlistIdOrUrl}`);
  }

  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
  const response = await fetch(playlistUrl, {
    headers: DEFAULT_FETCH_HEADERS,
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`تعذر جلب صفحة قائمة التشغيل (${response.status}): ${playlistUrl}`);
  }

  const html = await response.text();
  const ytData = extractYtInitialData(html);
  if (!ytData) {
    throw new Error('تعذر قراءة بيانات صفحة قائمة التشغيل من يوتيوب (ytInitialData is missing)');
  }

  // التحقق من وجود أخطاء صريحة مثل قائمة غير موجودة
  const alertText = ytData.alerts?.[0]?.alertRenderer?.text?.runs?.[0]?.text;
  if (alertText && alertText.includes('غير موجودة')) {
    throw new Error(`قائمة التشغيل غير موجودة في يوتيوب (ID: ${playlistId})`);
  }

  // 1. استخراج بيانات الترويسة (Header)
  const header = ytData.header?.playlistHeaderRenderer || ytData.sidebar?.playlistSidebarRenderer?.items?.[0]?.playlistSidebarPrimaryInfoRenderer;
  const rawTitle =
    header?.title?.simpleText ||
    header?.title?.runs?.[0]?.text ||
    ytData.microformat?.microformatDataRenderer?.title ||
    'قائمة يوتيوب التعليمية';

  const channelTitle =
    header?.ownerText?.runs?.[0]?.text ||
    header?.videoOwner?.videoOwnerRenderer?.title?.runs?.[0]?.text ||
    '';

  const rawCountText =
    header?.numVideosText?.runs?.[0]?.text ||
    header?.briefStats?.[0]?.runs?.[0]?.text ||
    '';
  const parsedCount = parseInt(rawCountText.replace(/[^\d]/g, ''), 10) || 0;

  // 2. استخراج الفيديوهات الأولية من جسم الصفحة (الدورات حتى 100 فيديو)
  const tabs = ytData.contents?.twoColumnBrowseResultsRenderer?.tabs;
  const sectionList = tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];
  const rawItems = sectionList?.[0]?.itemSectionRenderer?.contents || [];

  const videos = [];
  let currentIdx = 1;

  for (const rawItem of rawItems) {
    const parsed = parsePlaylistItem(rawItem, currentIdx);
    if (parsed) {
      videos.push(parsed);
      currentIdx++;
      if (videos.length >= maxVideos) break;
    }
  }

  // 3. دعم القوائم التي تضم أكثر من 100 فيديو عبر الـ Continuations تلقائياً
  let continuationToken = extractContinuationToken(rawItems) || extractContinuationToken(sectionList);
  const { apiKey, clientVersion } = extractInnertubeConfig(html);

  if (fetchAll && continuationToken && apiKey && videos.length < maxVideos) {
    let keepPaging = true;
    let pageCount = 0;

    while (keepPaging && pageCount < 30 && continuationToken && videos.length < maxVideos) {
      pageCount++;
      const browseEndpoint = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}&prettyPrint=false`;

      try {
        const pageRes = await fetch(browseEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': YOUTUBE_DESKTOP_UA,
            'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
            Connection: 'close'
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            context: {
              client: {
                clientName: 'WEB',
                clientVersion,
                hl: 'ar'
              }
            },
            continuation: continuationToken
          })
        });

        if (!pageRes.ok) break;

        const pageJson = await pageRes.json();
        const actions = pageJson.onResponseReceivedActions || pageJson.onResponseReceivedEndpoints || [];
        const container =
          actions?.[0]?.appendContinuationItemsAction || actions?.[0]?.reloadContinuationItemsCommand;

        const nextRawItems = container?.continuationItems || [];
        if (nextRawItems.length === 0) {
          keepPaging = false;
          break;
        }

        for (const rawItem of nextRawItems) {
          const parsed = parsePlaylistItem(rawItem, currentIdx);
          if (parsed) {
            videos.push(parsed);
            currentIdx++;
            if (videos.length >= maxVideos) break;
          }
        }

        continuationToken = extractContinuationToken(nextRawItems);
        if (!continuationToken) {
          keepPaging = false;
        }
      } catch (err) {
        console.warn('تحذير أثناء جلب صفحة تكميلية لقائمة التشغيل:', err.message);
        break;
      }
    }
  }

  // الصورة الرسمية عالية الجودة للقائمة
  const firstVideoId = videos[0]?.videoId;
  const officialThumbnail = firstVideoId
    ? `https://i.ytimg.com/vi/${firstVideoId}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${playlistId}/hqdefault.jpg`;

  return {
    playlistId,
    title: rawTitle.trim(),
    channelTitle: channelTitle.trim(),
    videoCount: parsedCount || videos.length,
    thumbnail: officialThumbnail,
    videos,
    hasMore: Boolean(continuationToken && videos.length < (parsedCount || maxVideos))
  };
}
