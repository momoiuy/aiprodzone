'use client';

import React from 'react';
import Watch from '../views/Watch';

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
