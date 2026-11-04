// دوال التعامل الشاملة مع روابط وفيديوهات وقوائم تشغيل يوتيوب
export function parseYouTubeUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./i, '').replace(/^m\./i, '').toLowerCase();

    // روابط youtu.be المختصرة
    if (host === 'youtu.be') {
      const seg = parsed.pathname.split('/').filter(Boolean)[0];
      if (seg && /^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }

    // نطاقات youtube.com و youtube-nocookie.com
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (
        parts.length >= 2 &&
        ['embed', 'shorts', 'live', 'v'].includes(parts[0].toLowerCase())
      ) {
        const candidate = parts[1];
        if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) {
          return candidate;
        }
      }
    }
  } catch {
    // الانتقال إلى التعبير النمطي في حال فشل تحليل الرابط
  }

  // التعبير النمطي الشامل لكافة صيغ يوتيوب (watch, embed, shorts, live, v, youtu.be)
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&/#]|$)/i;
  const match = trimmed.match(regex);
  if (match) return match[1];

  // إذا تم إدخال معرّف فيديو مجرد بدون أي رابط أو أحرف خاصة غير مألوفة
  if (
    /^[a-zA-Z0-9_-]{11}$/.test(trimmed) &&
    !trimmed.includes('-url') &&
    !trimmed.includes('test') &&
    !trimmed.includes('invalid')
  ) {
    return trimmed;
  }

  return null;
}

// الاسم البديل لدعم التوافقية العكسية
export const extractYouTubeId = parseYouTubeUrl;

/**
 * تحليل واستخراج معرف قائمة التشغيل الحقيقي من رابط أو نص
 * @param {string} rawUrl
 * @returns {string|null}
 */
export function parsePlaylistId(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const listParam = parsed.searchParams.get('list');
    if (listParam && /^([a-zA-Z0-9_-]{10,})$/.test(listParam)) {
      return listParam;
    }
  } catch {
    // الانتقال للتعبير النمطي
  }

  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]{10,})/i);
  if (match) return match[1];

  if (/^(PL|UU|FL|OLAK5uy_)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export const extractPlaylistId = parsePlaylistId;

/**
 * توليد رابط الصورة المصغرة الرسمية عالية الجودة من i.ytimg.com
 * @param {string} videoId
 * @param {'maxres'|'hq'|'mq'|'default'} quality
 * @returns {string}
 */
export function getYouTubeThumbnail(videoId, quality = 'hq') {
  if (!videoId) return FALLBACK_THUMBNAIL_SRC;
  const filename = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg';
  return `https://i.ytimg.com/vi/${videoId}/${filename}`;
}

/**
 * توليد رابط الصورة المصغرة لقائمة تشغيل كاملة
 * @param {string} firstVideoId
 * @param {string} playlistId
 * @param {'maxres'|'hq'} quality
 * @returns {string}
 */
export function getYouTubePlaylistThumbnail(firstVideoId, playlistId, quality = 'maxres') {
  if (firstVideoId) {
    return getYouTubeThumbnail(firstVideoId, quality);
  }
  if (playlistId) {
    return `https://i.ytimg.com/vi/${playlistId}/hqdefault.jpg`;
  }
  return FALLBACK_THUMBNAIL_SRC;
}

/**
 * توليد رابط التضمين الآمن الخالي من ملفات تعريف الارتباط والإعلانات الخارجية (youtube-nocookie)
 * يدعم تشغيل فيديو محدد، أو تشغيله ضمن سياق قائمة تشغيل، أو تشغيل قائمة كاملة عبر videoseries.
 *
 * @param {string|null} videoId
 * @param {Object} options
 * @param {boolean} [options.autoplay=false]
 * @param {number} [options.startSeconds=0]
 * @param {string|null} [options.playlistId=null]
 * @param {number|null} [options.index=null]
 * @returns {string}
 */
export function getCleanYouTubeEmbedUrl(
  videoId,
  { autoplay = false, startSeconds = 0, playlistId = null, index = null } = {}
) {
  const cleanVideoId = parseYouTubeUrl(videoId);
  const activePlaylist =
    playlistId ||
    (typeof videoId === 'string' && videoId.startsWith('PL') ? videoId : null);

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    enablejsapi: '1'
  });
  if (autoplay) params.set('autoplay', '1');
  if (startSeconds > 0) params.set('start', String(startSeconds));

  // الحالة الأولى: تم تحديد videoId صريح
  if (cleanVideoId) {
    // إذا كانت هناك أيضاً قائمة تشغيل، نربط الفيديو بالقائمة ليظهر فهرس التشغيل داخل يوتيوب
    if (activePlaylist && activePlaylist !== cleanVideoId) {
      params.set('list', activePlaylist);
      if (typeof index === 'number' && index >= 0) {
        params.set('index', String(index));
      }
    }
    return `https://www.youtube-nocookie.com/embed/${cleanVideoId}?${params.toString()}`;
  }

  // الحالة الثانية: تم تمرير معرّف قائمة تشغيل فقط دون videoId محدد
  if (activePlaylist) {
    params.set('list', activePlaylist);
    if (typeof index === 'number' && index >= 0) {
      params.set('index', String(index));
    }
    return `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`;
  }

  return '';
}

/**
 * توليد رابط تضمين نظيف لقائمة تشغيل كاملة (videoseries)
 * @param {string} playlistId
 * @param {Object} options
 * @returns {string}
 */
export function getCleanYouTubePlaylistEmbedUrl(playlistId, { autoplay = false, index = 0 } = {}) {
  return getCleanYouTubeEmbedUrl(null, { autoplay, playlistId, index });
}

export function toSeconds(time) {
  if (typeof time !== 'string') return 0;
  const trimmed = time.trim();
  if (!trimmed) return 0;
  const parts = trimmed.split(':').map((part) => Number(part));
  if (parts.some((n) => Number.isNaN(n) || n < 0 || !Number.isFinite(n))) {
    return 0;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Math.floor(minutes * 60 + seconds);
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return Math.floor(hours * 3600 + minutes * 60 + seconds);
  }
  return 0;
}

export const FALLBACK_THUMBNAIL_SRC =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='640' height='360' fill='black'/><rect x='16' y='16' width='608' height='328' rx='16' fill='darkslategray' stroke='teal' stroke-opacity='0.45' stroke-width='2'/><polygon points='295,145 295,215 355,180' fill='teal'/></svg>";

/**
 * معالج تحميل الصورة المصغرة الذكي:
 * يوتيوب يعيد صورة 120x90 رمادية (تحتوي على 3 نقاط) مع كود 404 بدلاً من إطلاق خطأ شبكة.
 * نقوم بفحص الأبعاد الحقيقية فور تحميلها، وإذا كانت الصورة البديلة الرمادية نستبدلها فوراً بـ hqdefault.
 */
export function handleThumbnailLoad(e) {
  const img = e.currentTarget;
  if (!img) return;
  // الأبعاد الطبيعية لصورة الخطأ 404 من خوادم يوتيوب هي 120x90
  if (img.naturalWidth > 0 && img.naturalWidth <= 120 && img.naturalHeight <= 90) {
    const currentSrc = img.src || '';
    if (currentSrc.includes('/maxresdefault.jpg')) {
      img.src = currentSrc.replace('/maxresdefault.jpg', '/hqdefault.jpg');
    } else if (currentSrc.includes('/hqdefault.jpg')) {
      img.src = currentSrc.replace('/hqdefault.jpg', '/mqdefault.jpg');
    } else if (currentSrc !== FALLBACK_THUMBNAIL_SRC) {
      img.src = FALLBACK_THUMBNAIL_SRC;
    }
  }
}

export function handleThumbnailError(e) {
  const img = e.currentTarget;
  if (!img) return;
  const currentSrc = img.src || '';
  if (currentSrc.includes('/maxresdefault.jpg')) {
    img.src = currentSrc.replace('/maxresdefault.jpg', '/hqdefault.jpg');
  } else if (currentSrc.includes('/sddefault.jpg')) {
    img.src = currentSrc.replace('/sddefault.jpg', '/hqdefault.jpg');
  } else if (currentSrc.includes('/hqdefault.jpg')) {
    img.src = currentSrc.replace('/hqdefault.jpg', '/mqdefault.jpg');
  } else if (currentSrc.includes('/mqdefault.jpg')) {
    img.src = currentSrc.replace('/mqdefault.jpg', '/default.jpg');
  } else if (currentSrc !== FALLBACK_THUMBNAIL_SRC) {
    img.src = FALLBACK_THUMBNAIL_SRC;
  }
}
