'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, ExternalLink, CheckCircle2, ArrowLeft, RotateCcw } from 'lucide-react';
import { handleThumbnailError, getCleanYouTubeEmbedUrl } from '../lib/youtube';
import Card from './Card';
import Button from './Button';

/**
 * مشغل يوتيوب الاحترافي والآمن بنمط Lite Facade
 * - تضمين نظيف بدون فيديوهات عشوائية (youtube-nocookie)
 * - تحميل خفيف وسريع بنسبة 100% عبر Facade
 * - استماع لأحداث IFrame API لوضع علامة مكتمل وتفعيل زر الدرس التالي تلقائياً
 */
export default function YouTubePlayer({
  course,
  playing = false,
  startSeconds = 0,
  reloadKey = 0,
  nextLesson = null,
  onStartFacade,
  onVideoEnd,
  onNextLesson
}) {
  const [isPlaying, setIsPlaying] = useState(playing);
  const [hasEnded, setHasEnded] = useState(false);
  const iframeRef = useRef(null);
  const playerInstanceRef = useRef(null);

  const videoId = course?.youtubeVideoId || course?.youtubeId;

  // مزامنة حالة التشغيل الخارجية
  useEffect(() => {
    setIsPlaying(playing);
  }, [playing]);

  // إعادة ضبط حالة الانتهاء عند تغيير الفيديو
  useEffect(() => {
    setHasEnded(false);
  }, [videoId, reloadKey]);

  const handleEnded = useCallback(() => {
    setHasEnded(true);
    if (typeof onVideoEnd === 'function' && course?.id) {
      onVideoEnd(course.id);
    }
  }, [course?.id, onVideoEnd]);

  // الاستماع لرسائل YouTube IFrame API عبر postMessage لضمان أقصى توافقية وسرعة
  useEffect(() => {
    if (!isPlaying) return;

    const handleWindowMessage = (event) => {
      // التأكد من أن الرسالة قادمة من نطاق يوتيوب
      if (!event.origin.includes('youtube.com') && !event.origin.includes('youtube-nocookie.com')) {
        return;
      }

      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
        }

        // event 0 في YouTube IFrame API يعني انتهاء الفيديو (ENDED)
        if (payload?.event === 'onStateChange' && payload?.info === 0) {
          handleEnded();
        }
      } catch {
        // تجاهل الرسائل غير المتوافقة مع JSON
      }
    };

    window.addEventListener('message', handleWindowMessage);

    // تفعيل إرسال الأحداث من iframe بمجرد جاهزيته
    const timer = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening', id: `yt-${videoId}` }),
          '*'
        );
      }
    }, 1200);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
      clearTimeout(timer);
    };
  }, [isPlaying, videoId, handleEnded]);

  const handleStart = () => {
    setIsPlaying(true);
    setHasEnded(false);
    if (typeof onStartFacade === 'function') {
      onStartFacade();
    }
  };

  const handleReplay = () => {
    setHasEnded(false);
    setIsPlaying(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
        '*'
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
    }
  };

  const embedUrl = getCleanYouTubeEmbedUrl(videoId, {
    autoplay: true,
    startSeconds
  });

  return (
    <Card className="overflow-hidden bg-surface-2 shadow-xl border border-border">
      <div className="relative aspect-video w-full bg-black select-none">
        {isPlaying ? (
          <>
            <iframe
              ref={iframeRef}
              id={`yt-${videoId}`}
              key={`${videoId}-${startSeconds}-${reloadKey}`}
              className="w-full h-full border-0"
              src={embedUrl}
              title={course?.title || 'مشغل فيديو AIProdZone'}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* بطاقة الإكمال والانتقال إلى الدرس التالي عند انتهاء الفيديو */}
            {hasEnded && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-smooth">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent text-accent-ink flex items-center justify-center mb-3 shadow-2xl">
                  <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9" />
                </div>

                <h3 className="text-base sm:text-xl font-extrabold text-white">
                  أحسنت! أكملت مشاهدة هذا الدرس بنجاح
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">
                  تم وضع علامة &quot;مكتمل&quot; تلقائياً لهذا الدرس وحفظ تقدمك في المسار التعليمي.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {nextLesson && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setHasEnded(false);
                        if (typeof onNextLesson === 'function') {
                          onNextLesson(nextLesson.id);
                        }
                      }}
                      className="px-5 py-2.5 text-xs sm:text-sm font-extrabold shadow-lg"
                    >
                      <span>الانتقال للدرس التالي #{nextLesson.orderIndex || nextLesson.rankOrder}: {nextLesson.title}</span>
                      <ArrowLeft className="w-4 h-4 text-accent-ink" />
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    onClick={handleReplay}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة تشغيل الدرس</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* واجهة Facade الخفيفة فائقة السرعة */
          <div
            onClick={handleStart}
            className="group relative w-full h-full cursor-pointer select-none overflow-hidden"
          >
            <img
              src={course?.thumbnail}
              alt={course?.title}
              loading="lazy"
              decoding="async"
              onError={handleThumbnailError}
              className="w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent text-accent-ink shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label="تشغيل الفيديو"
              >
                <Play className="w-6 h-6 fill-current" />
              </button>

              <p className="mt-3 text-xs sm:text-sm font-extrabold text-white drop-shadow line-clamp-1 max-w-[90%]">
                {course?.title}
              </p>

              {course?.runtime && (
                <span className="mt-1.5 px-2.5 py-0.5 rounded-lg bg-black/75 border border-white/15 text-[11px] font-mono text-white">
                  {course.runtime}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* الشريط السفلي المتناسق مع التصميم */}
      <div className="px-3.5 py-2.5 border-t border-border bg-surface flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="text-text-muted">
          تضمين فائق الخصوصية والنظافة (Clean No-Cookie Embed) مع حفظ تلقائي لمستوى تقدمك.
        </span>

        {videoId && (
          <a
            href={`https://www.youtube.com/watch?v=${videoId}${
              startSeconds > 0 ? `&t=${startSeconds}s` : ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl font-extrabold inline-flex items-center gap-1.5 shrink-0 bg-surface-2 text-text border border-border hover:border-accent hover:text-text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <span>فتح في يوتيوب</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
        )}
      </div>
    </Card>
  );
}
