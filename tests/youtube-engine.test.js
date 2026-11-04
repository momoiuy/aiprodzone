import { describe, it, expect } from 'vitest';
import {
  parsePlaylistId,
  extractPlaylistId,
  getYouTubeThumbnail,
  getYouTubePlaylistThumbnail,
  getCleanYouTubeEmbedUrl,
  getCleanYouTubePlaylistEmbedUrl
} from '../src/lib/youtube';
import {
  extractYtInitialData,
  extractInnertubeConfig,
  parsePlaylistItem,
  extractContinuationToken
} from '../src/lib/youtube-scraper';
import { REAL_YOUTUBE_PLAYLISTS } from '../src/data/real-playlists';
import { INITIAL_COURSES } from '../src/data/courses';

describe('YouTube Zero-Hallucination Engine - Helper Functions', () => {
  it('extracts playlist ID from various URL patterns and bare IDs', () => {
    const p1 = 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs';
    const p2 = 'https://www.youtube.com/watch?v=mvZHDpCHphk&list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs&index=1';
    const p3 = 'https://youtu.be/mvZHDpCHphk?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs';
    const bare = 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs';

    expect(parsePlaylistId(p1)).toBe('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(extractPlaylistId(p2)).toBe('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(parsePlaylistId(p3)).toBe('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(parsePlaylistId(bare)).toBe('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
  });

  it('handles invalid or empty playlist strings safely', () => {
    expect(parsePlaylistId('')).toBeNull();
    expect(parsePlaylistId(null)).toBeNull();
    expect(parsePlaylistId(undefined)).toBeNull();
    expect(parsePlaylistId('not-a-valid-playlist-id')).toBeNull();
  });

  it('generates official high-res thumbnails from i.ytimg.com', () => {
    const thumbMax = getYouTubeThumbnail('mvZHDpCHphk', 'maxres');
    expect(thumbMax).toBe('https://i.ytimg.com/vi/mvZHDpCHphk/maxresdefault.jpg');

    const thumbHq = getYouTubeThumbnail('mvZHDpCHphk', 'hq');
    expect(thumbHq).toBe('https://i.ytimg.com/vi/mvZHDpCHphk/hqdefault.jpg');

    const playlistThumb = getYouTubePlaylistThumbnail('mvZHDpCHphk', 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(playlistThumb).toBe('https://i.ytimg.com/vi/mvZHDpCHphk/maxresdefault.jpg');
  });

  it('embeds specific lesson videoId within playlist context', () => {
    const embedUrl = getCleanYouTubeEmbedUrl('02a5T6ktx8M', {
      autoplay: true,
      playlistId: 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs',
      index: 1
    });

    expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/02a5T6ktx8M');
    expect(embedUrl).toContain('list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(embedUrl).toContain('index=1');
    expect(embedUrl).toContain('enablejsapi=1');
    expect(embedUrl).toContain('autoplay=1');
  });

  it('embeds playlist via videoseries when videoId is not provided', () => {
    const embedUrl = getCleanYouTubePlaylistEmbedUrl('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs', {
      autoplay: false,
      index: 0
    });

    expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/videoseries');
    expect(embedUrl).toContain('list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(embedUrl).toContain('index=0');
  });
});

describe('YouTube Scraper Parser & Innertube Extraction', () => {
  it('extracts ytInitialData from HTML script block', () => {
    const mockHtml = `<html><head><script>var ytInitialData = {"header":{"title":{"simpleText":"Mastering Python"}}};</script></head></html>`;
    const data = extractYtInitialData(mockHtml);
    expect(data).toBeDefined();
    expect(data.header.title.simpleText).toBe('Mastering Python');
  });

  it('extracts Innertube API key and client version', () => {
    const mockHtml = `{"INNERTUBE_API_KEY":"AIzaSyMockKey123","INNERTUBE_CLIENT_VERSION":"2.20261030.02.00"}`;
    const { apiKey, clientVersion } = extractInnertubeConfig(mockHtml);
    expect(apiKey).toBe('AIzaSyMockKey123');
    expect(clientVersion).toBe('2.20261030.02.00');
  });

  it('parses modern lockupViewModel item correctly', () => {
    const rawLockup = {
      lockupViewModel: {
        contentId: 'mvZHDpCHphk',
        metadata: {
          lockupMetadataViewModel: {
            title: { content: 'تعلم لغة Python درس 001# - مقدمة عن الدورة' }
          }
        },
        contentImage: {
          thumbnailViewModel: {
            overlays: [
              {
                thumbnailBottomOverlayViewModel: {
                  badges: [
                    { thumbnailBadgeViewModel: { text: '11:54' } }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const parsed = parsePlaylistItem(rawLockup, 1);
    expect(parsed).toBeDefined();
    expect(parsed.index).toBe(1);
    expect(parsed.videoId).toBe('mvZHDpCHphk');
    expect(parsed.title).toContain('درس 001#');
    expect(parsed.duration).toBe('11:54');
    expect(parsed.thumbnail).toContain('mvZHDpCHphk');
  });

  it('parses classic playlistVideoRenderer item correctly', () => {
    const rawClassic = {
      playlistVideoRenderer: {
        videoId: '02a5T6ktx8M',
        index: { simpleText: '2' },
        title: { simpleText: 'تعلم لغة Python درس 002# - ماذا تحتاج لتبدأ' },
        lengthText: { simpleText: '07:20' }
      }
    };

    const parsed = parsePlaylistItem(rawClassic, 2);
    expect(parsed).toBeDefined();
    expect(parsed.index).toBe(2);
    expect(parsed.videoId).toBe('02a5T6ktx8M');
    expect(parsed.title).toContain('درس 002#');
    expect(parsed.duration).toBe('07:20');
  });

  it('extracts continuation token for pagination of 100+ items', () => {
    const items = [
      {
        continuationItemViewModel: {
          continuationCommand: {
            continuationCommand: {
              token: 'mockContinuationToken12345'
            }
          }
        }
      }
    ];

    const token = extractContinuationToken(items);
    expect(token).toBe('mockContinuationToken12345');
  });
});

describe('Zero-Hallucination Verified Data Quality (Elzero Python)', () => {
  it('contains the verified 152 real lessons with zero hallucination', () => {
    const playlistId = 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs';
    const playlistData = REAL_YOUTUBE_PLAYLISTS[playlistId];

    expect(playlistData).toBeDefined();
    expect(playlistData.playlistId).toBe(playlistId);
    expect(playlistData.channelTitle).toBe('Elzero Web School');
    expect(playlistData.videoCount).toBe(152);
    expect(playlistData.videos.length).toBe(152);

    // التحقق من الدرس الأول الحقيقي
    const firstLesson = playlistData.videos[0];
    expect(firstLesson.index).toBe(1);
    expect(firstLesson.videoId).toBe('mvZHDpCHphk');
    expect(firstLesson.title).toContain('001#');
    expect(firstLesson.duration).toBe('11:54');

    // التحقق من الدرس 100 الحقيقي
    const lesson100 = playlistData.videos[99];
    expect(lesson100.index).toBe(100);
    expect(lesson100.videoId).toBe('UKA-3O7XwPs');
    expect(lesson100.title).toContain('100#');

    // التحقق من الدرس الأخير الحقيقي #152
    const lastLesson = playlistData.videos[151];
    expect(lastLesson.index).toBe(152);
    expect(lastLesson.videoId).toBe('OwV5R8Qy1e4');
    expect(lastLesson.title).toContain('152#');
  });

  it('verifies that python-masterclass course is wired with the real 152 lessons', () => {
    const pythonTrack = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    expect(pythonTrack).toBeDefined();

    const elzero = pythonTrack.instructors.find((i) => i.id === 'inst-osama-elzero');
    expect(elzero).toBeDefined();
    expect(elzero.playlistId).toBe('PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs');
    expect(elzero.lessons.length).toBe(152);

    // تسلسل الفهرس من 1 إلى 152 دون أي فراغات أو أخطاء
    elzero.lessons.forEach((l, idx) => {
      expect(l.index).toBe(idx + 1);
      expect(l.videoId.length).toBe(11);
      expect(l.title.length).toBeGreaterThan(0);
    });
  });
});
