'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Watch = dynamic(() => import('../views/Watch'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[300px] bg-surface-2/60 rounded-3xl border border-border/70 flex items-center justify-center p-8 animate-pulse text-text-muted text-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>جاري تحميل مشغل الدروس والتفاعل...</span>
      </div>
    </div>
  )
});

export interface TrackWatchClientProps {
  course: any;
}

export default function TrackWatchClient({ course }: TrackWatchClientProps) {
  return (
    <Watch
      course={course}
      onBack={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }}
      onWatchCourse={(courseId: string) => {
        if (typeof window !== 'undefined') {
          window.location.href = `/tracks/${courseId}`;
        }
      }}
    />
  );
}
