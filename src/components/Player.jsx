import React from 'react';
import dynamic from 'next/dynamic';

const YouTubePlayer = dynamic(() => import('./YouTubePlayer'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-surface-2 rounded-2xl flex items-center justify-center animate-pulse" dir="rtl">
      <div className="flex flex-col items-center gap-2 text-text-muted text-xs">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>جاري تهيئة مشغل الفيديو الآمن...</span>
      </div>
    </div>
  )
});

export default function Player(props) {
  return <YouTubePlayer {...props} />;
}
