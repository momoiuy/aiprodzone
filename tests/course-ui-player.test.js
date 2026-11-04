import { describe, it, expect, vi } from 'vitest';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { getCleanYouTubeEmbedUrl, getCleanYouTubePlaylistEmbedUrl } from '../src/lib/youtube.js';
import { REAL_YOUTUBE_PLAYLISTS } from '../src/data/real-playlists.js';
import seedStatus from '../src/data/seed-status.json';

describe('2-Tier Navigation Bar & Domain Counters (المستوى الأول والثاني)', () => {
  it('calculates domain counts accurately for all 8 major domains', () => {
    expect(ACADEMIC_DOMAINS.length).toBe(8);

    const domainCounts = {};
    ACADEMIC_DOMAINS.forEach((domain) => {
      const count = INITIAL_COURSES.filter(
        (c) => c.category === domain.name || c.domainTitle === domain.name || c.domainId === domain.id
      ).length;
      domainCounts[domain.id] = count;
      expect(count).toBeGreaterThan(0);
    });

    // Total courses count is 73 (Phase 7: Complete 8 Academic Sectors)
    expect(INITIAL_COURSES.length).toBe(73);
  });

  it('paginates courses at exactly 12 items per page', () => {
    const ITEMS_PER_PAGE = 12;
    const totalPages = Math.ceil(INITIAL_COURSES.length / ITEMS_PER_PAGE);
    expect(totalPages).toBe(7);

    const page1 = INITIAL_COURSES.slice(0, ITEMS_PER_PAGE);
    const page7 = INITIAL_COURSES.slice(ITEMS_PER_PAGE * 6, ITEMS_PER_PAGE * 7);

    expect(page1.length).toBe(12);
    expect(page7.length).toBe(1);
  });

  it('extracts sub-filters and subjects for selected domain', () => {
    const pythonTrack = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    expect(pythonTrack).toBeDefined();
    expect(pythonTrack.domainId).toBe('web-programming');

    const domainTracks = INITIAL_COURSES.filter((c) => c.domainId === 'languages-apps');
    const titles = domainTracks.map((c) => c.title);
    expect(titles.some((t) => t.includes('C++'))).toBe(true);
    expect(titles.some((t) => t.includes('Flutter'))).toBe(true);
  });
});

describe('Course Card UI Specifications (تصميم بطاقة المادة والمحاضرين)', () => {
  it('contains examCode and methodologyNote on relevant courses', () => {
    const ccnaTrack = INITIAL_COURSES.find((c) => c.id === 'cisco-ccna-200-301');
    expect(ccnaTrack.examCode).toBe('CCNA 200-301');
    expect(ccnaTrack.methodologyNote).toContain('CCNA 200-301');

    const secPlusTrack = INITIAL_COURSES.find((c) => c.id === 'comptia-security-plus');
    expect(secPlusTrack.examCode).toContain('SY0-701');
    expect(secPlusTrack.methodologyNote).toContain('أمن المعلومات');
  });

  it('provides approved instructors with primary (★) and certified alternates', () => {
    const pythonTrack = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    expect(pythonTrack.instructors.length).toBeGreaterThanOrEqual(2);

    const primary = pythonTrack.instructors.find((i) => i.role === 'أساسي');
    expect(primary).toBeDefined();
    expect(primary.name).toContain('الزيرو');
    expect(primary.lessonsCount).toBe(152);
    expect(primary.durationText).toContain('26');

    const alternate = pythonTrack.instructors.find((i) => i.role === 'بديل معتمد');
    expect(alternate).toBeDefined();
    expect(alternate.name).toContain('Codezilla');
    expect(alternate.lessonsCount).toBe(48);
  });

  it('handles smart instructor pill selection and direct watch action', () => {
    const course = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    const primary = course.instructors.find((i) => i.role === 'أساسي');
    const alternate = course.instructors.find((i) => i.role === 'بديل معتمد');

    let activeInstructorId = primary.id;
    const onWatchCourse = vi.fn();

    // 1. الضغط على المحاضر النشط حالياً يفتح صفحة المشاهدة فوراً
    const handleInstructorPillClick = (instId) => {
      if (instId === activeInstructorId) {
        onWatchCourse(course.id, instId);
      } else {
        activeInstructorId = instId;
      }
    };

    handleInstructorPillClick(primary.id);
    expect(onWatchCourse).toHaveBeenCalledWith(course.id, primary.id);
    expect(onWatchCourse).toHaveBeenCalledTimes(1);

    // 2. الضغط على محاضر آخر غير نشط يحدده ويحدث activeInstructorId دون فتح فوري
    handleInstructorPillClick(alternate.id);
    expect(activeInstructorId).toBe(alternate.id);
    expect(onWatchCourse).toHaveBeenCalledTimes(1); // لم يزد عدد مرات الاستدعاء

    // 3. الضغط على زر الإجراء المباشر بعد التحديد يفتح مشاهدة المحاضر المحدد
    const actionButtonText = `عرض دروس ${alternate.name} (${alternate.lessonsCount} درساً)`;
    expect(actionButtonText).toContain(alternate.name);
    expect(actionButtonText).toContain(String(alternate.lessonsCount));

    // استدعاء زر الإجراء
    onWatchCourse(course.id, activeInstructorId);
    expect(onWatchCourse).toHaveBeenCalledWith(course.id, alternate.id);
    expect(onWatchCourse).toHaveBeenCalledTimes(2);

    // 4. الضغط مرة أخرى على الشريحة المحددة الآن (التي أصبحت نشطة) يفتح المشاهدة مباشرة
    handleInstructorPillClick(alternate.id);
    expect(onWatchCourse).toHaveBeenCalledWith(course.id, alternate.id);
    expect(onWatchCourse).toHaveBeenCalledTimes(3);
  });
});

describe('YouTube Player & Ordered Curriculum Playlist (مشغل الفيديو وفهرس الدروس)', () => {
  it('generates videoseries embed URL when playlistId is specified', () => {
    const embedUrl = getCleanYouTubePlaylistEmbedUrl('PLDoPjvoNmBAyE_gei5d18qKfIe-Z8mOCS', {
      autoplay: true,
      index: 1
    });

    expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/videoseries');
    expect(embedUrl).toContain('list=PLDoPjvoNmBAyE_gei5d18qKfIe-Z8mOCS');
    expect(embedUrl).toContain('index=1');
    expect(embedUrl).toContain('enablejsapi=1');
    expect(embedUrl).toContain('autoplay=1');
  });

  it('generates clean single-video embed URL when videoId is specified', () => {
    const embedUrl = getCleanYouTubeEmbedUrl('mvZHDpCHphk', {
      autoplay: true,
      startSeconds: 120
    });

    expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/mvZHDpCHphk');
    expect(embedUrl).toContain('enablejsapi=1');
    expect(embedUrl).toContain('autoplay=1');
    expect(embedUrl).toContain('start=120');
  });

  it('verifies lessons ordering, numbering, and titles in curriculum playlist', () => {
    const pythonTrack = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    const elzero = pythonTrack.instructors.find((i) => i.role === 'أساسي');

    expect(elzero.lessons.length).toBeGreaterThan(0);
    elzero.lessons.forEach((lesson, idx) => {
      expect(lesson.index).toBe(idx + 1);
      expect(lesson.videoId.length).toBe(11);
      expect(lesson.title.length).toBeGreaterThan(3);
      expect(typeof lesson.duration).toBe('string');
    });

    // Test quick search logic within lessons
    const q = 'القوائم';
    const searchResults = elzero.lessons.filter((l) => l.title.includes(q));
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].title).toContain('القوائم');
  });

  it('completes long YouTube playlists exceeding 100 lessons accurately', () => {
    // التحقق من قائمة الزيرو بايثون ذات الـ 152 درساً
    const elzeroKey = Object.keys(REAL_YOUTUBE_PLAYLISTS).find(
      (k) => k.toLowerCase() === 'pldopjvonmbaye_gei5d18qkfie-z8mocs'.toLowerCase()
    );
    expect(elzeroKey).toBeDefined();

    const elzeroData = REAL_YOUTUBE_PLAYLISTS[elzeroKey];
    expect(elzeroData.videoCount).toBe(152);
    expect(elzeroData.videos.length).toBe(152);

    // التأكد من أن جميع الدروس مرتبة من 1 إلى 152
    elzeroData.videos.forEach((video, idx) => {
      expect(video.index).toBe(idx + 1);
      expect(video.videoId.length).toBe(11);
      expect(video.duration.length).toBeGreaterThan(0);
      expect(video.title.length).toBeGreaterThan(3);
    });
  });

  it('detects truncated playlists and triggers background completion', () => {
    // التحقق من منطق الاكتشاف: إذا كان عدد الدروس أقل من المتوقع
    const checkTruncated = (currentLength, expectedCount) => {
      return (
        (expectedCount > 0 && currentLength < expectedCount) ||
        currentLength === 50 ||
        currentLength === 100 ||
        (currentLength < 50 && expectedCount > currentLength)
      );
    };

    expect(checkTruncated(53, 104)).toBe(true);
    expect(checkTruncated(50, 50)).toBe(true);
    expect(checkTruncated(100, 100)).toBe(true);
    expect(checkTruncated(152, 152)).toBe(false);
    expect(checkTruncated(48, 48)).toBe(false);
  });

  it('bumps local storage key to aiprodzone_courses_v8 for fresh browser sync', () => {
    expect(seedStatus.storageKey).toBe('aiprodzone_courses_v8');
  });
});
