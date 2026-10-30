import { describe, it, expect } from 'vitest';
import { parseYouTubeUrl, extractYouTubeId, toSeconds, getCleanYouTubeEmbedUrl } from '../src/lib/youtube';
import { formatViews, getOverallScore } from '../src/lib/format';

describe('YouTube utility functions', () => {
  it('extracts ID from standard watch URL', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
    expect(extractYouTubeId('https://www.youtube.com/watch?v=FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
  });

  it('extracts ID from youtu.be short URL', () => {
    expect(parseYouTubeUrl('https://youtu.be/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
    expect(extractYouTubeId('https://youtu.be/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
  });

  it('extracts ID from embed URL', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/embed/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
    expect(extractYouTubeId('https://www.youtube.com/embed/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
  });

  it('extracts ID from shorts URL', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/shorts/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
    expect(extractYouTubeId('https://www.youtube.com/shorts/FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
  });

  it('handles raw 11-char video ID', () => {
    expect(parseYouTubeUrl('FOuA_ct11DQ')).toBe('FOuA_ct11DQ');
  });

  it('returns null for invalid URLs', () => {
    expect(parseYouTubeUrl('invalid-url')).toBe(null);
    expect(parseYouTubeUrl('')).toBe(null);
    expect(parseYouTubeUrl(null)).toBe(null);
  });

  it('generates clean embed URL with no-cookie and jsapi enabled', () => {
    const embedUrl = getCleanYouTubeEmbedUrl('FOuA_ct11DQ', { autoplay: true, startSeconds: 45 });
    expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/FOuA_ct11DQ');
    expect(embedUrl).toContain('rel=0');
    expect(embedUrl).toContain('modestbranding=1');
    expect(embedUrl).toContain('enablejsapi=1');
    expect(embedUrl).toContain('autoplay=1');
    expect(embedUrl).toContain('start=45');
  });

  it('converts mm:ss time to seconds', () => {
    expect(toSeconds('11:11')).toBe(671);
    expect(toSeconds('00:00')).toBe(0);
  });

  it('converts hh:mm:ss time to seconds', () => {
    expect(toSeconds('01:00:00')).toBe(3600);
    expect(toSeconds('05:00:31')).toBe(18031);
  });
});

describe('Formatting utility functions', () => {
  it('formats views correctly in K, M, or raw', () => {
    expect(formatViews(0)).toBe('جديد');
    expect(formatViews(500)).toBe('500');
    expect(formatViews(716000)).toBe('716K');
    expect(formatViews(2300000)).toBe('2.3M');
    expect(formatViews(1000000)).toBe('1M');
  });

  it('calculates average overall score with 1 decimal precision', () => {
    expect(
      getOverallScore({ depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.6 })
    ).toBe(9.7);
    expect(getOverallScore(null)).toBe(0);
  });
});
