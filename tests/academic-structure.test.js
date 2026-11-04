import { describe, it, expect } from 'vitest';
import { ACADEMIC_DOMAINS, SEED_CATEGORIES, CATEGORY_NAMES } from '../src/data/categories.js';
import {
  INITIAL_COURSES,
  INSTRUCTOR_ROLES,
  INSTRUCTOR_LANGUAGES,
  createCourseTrack,
  validateCourseTrack
} from '../src/data/courses.js';
import seedStatus from '../src/data/seed-status.json';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';

describe('Academic Domains Structure (الأقسام الأكاديمية الرئيسية الثمانية)', () => {
  it('contains exactly 8 academic domains in both ACADEMIC_DOMAINS and SEED_CATEGORIES', () => {
    expect(ACADEMIC_DOMAINS.length).toBe(8);
    expect(SEED_CATEGORIES.length).toBe(8);
    expect(CATEGORY_NAMES.length).toBe(8);
  });

  it('matches all 8 requested domain IDs in correct order', () => {
    const expectedIds = [
      'web-programming',
      'languages-apps',
      'computer-science',
      'databases-backend',
      'devops-cloud',
      'ai-data-science',
      'networking-cybersecurity',
      'business-languages'
    ];
    const actualIds = ACADEMIC_DOMAINS.map((d) => d.id);
    expect(actualIds).toEqual(expectedIds);
  });

  it('matches all 8 requested Arabic domain titles', () => {
    const expectedTitles = [
      'الويب والبرمجة',
      'لغات وتطبيقات وألعاب',
      'علوم الحاسوب',
      'قواعد البيانات والخلفية',
      'DevOps والسحابة والهندسة',
      'الذكاء الاصطناعي وعلم البيانات',
      'الشبكات والأمن السيبراني',
      'الأعمال واللغات'
    ];
    const actualTitles = ACADEMIC_DOMAINS.map((d) => d.name);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it('verifies metadata fields on every academic domain', () => {
    ACADEMIC_DOMAINS.forEach((domain, idx) => {
      expect(domain.orderIndex).toBe(idx + 1);
      expect(typeof domain.id).toBe('string');
      expect(typeof domain.name).toBe('string');
      expect(typeof domain.shortName).toBe('string');
      expect(typeof domain.description).toBe('string');
      expect(typeof domain.icon).toBe('string');
      expect(typeof domain.badge).toBe('string');
    });
  });
});

describe('Course Cleaning & Clean Initial State (تنظيف الدورات التجريبية والدليل الأكاديمي)', () => {
  it('ensures no old demo course IDs remain in INITIAL_COURSES', () => {
    const oldDemoIds = [
      'ai-film-curious-refuge',
      'kling-filmmaking-crux',
      'kling-camera-control',
      'prompt-eng-vanderbilt',
      'claude-prompt-anthropic'
    ];
    const currentIds = INITIAL_COURSES.map((c) => c.id);
    oldDemoIds.forEach((id) => {
      expect(currentIds).not.toContain(id);
    });
  });

  it('contains verified academic tracks across all 8 domains', () => {
    expect(INITIAL_COURSES.length).toBe(73);
    INITIAL_COURSES.forEach((track) => {
      const validation = validateCourseTrack(track);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  it('includes Python track with both Elzero and Codezilla instructors', () => {
    const pythonTrack = INITIAL_COURSES.find((c) => c.id === 'python-masterclass');
    expect(pythonTrack).toBeDefined();
    const instructorNames = pythonTrack.instructors.map((i) => i.name);
    expect(instructorNames.some((n) => n.includes('الزيرو'))).toBe(true);
    expect(instructorNames.some((n) => n.includes('Codezilla') || n.includes('كودزيلا'))).toBe(true);
  });

  it('verifies Stage 5 Computer Science, Databases and DevOps tracks with multiple instructors', () => {
    // 1. Algorithms
    const algoTrack = INITIAL_COURSES.find((c) => c.id === 'algorithms-masterclass');
    expect(algoTrack).toBeDefined();
    expect(algoTrack.instructors.length).toBe(3);
    expect(algoTrack.instructors.some((i) => i.name.includes('Hard-Code'))).toBe(true);
    expect(algoTrack.instructors.some((i) => i.name.includes('Adel Nasim'))).toBe(true);
    expect(algoTrack.instructors.some((i) => i.name.includes('الدسوقي'))).toBe(true);

    // 2. Data Structures
    const dsTrack = INITIAL_COURSES.find((c) => c.id === 'data-structures-masterclass');
    expect(dsTrack).toBeDefined();
    expect(dsTrack.instructors.length).toBe(3);
    expect(dsTrack.instructors.some((i) => i.name.includes('Adel Nasim'))).toBe(true);
    expect(dsTrack.instructors.some((i) => i.name.includes('Hard-Code'))).toBe(true);
    expect(dsTrack.instructors.some((i) => i.name.includes('السامولي'))).toBe(true);

    // 3. Docker
    const dockerTrack = INITIAL_COURSES.find((c) => c.id === 'docker-masterclass');
    expect(dockerTrack).toBeDefined();
    expect(dockerTrack.instructors.length).toBe(3);
    expect(dockerTrack.instructors.some((i) => i.name.includes('Codographia'))).toBe(true);
    expect(dockerTrack.instructors.some((i) => i.name.includes('Tresmerge'))).toBe(true);
    expect(dockerTrack.instructors.some((i) => i.name.includes('أحمد سامي'))).toBe(true);

    // 4. Git
    const gitTrack = INITIAL_COURSES.find((c) => c.id === 'git-github-masterclass');
    expect(gitTrack).toBeDefined();
    expect(gitTrack.instructors.length).toBe(3);
    expect(gitTrack.instructors.some((i) => i.name.includes('الزيرو'))).toBe(true);
    expect(gitTrack.instructors.some((i) => i.name.includes('الشافعي'))).toBe(true);
    expect(gitTrack.instructors.some((i) => i.name.includes('ترميز'))).toBe(true);
  });

  it('strictly prohibits broken instructor IDs like inst-- or empty IDs across all tracks', () => {
    INITIAL_COURSES.forEach((track) => {
      track.instructors.forEach((inst) => {
        expect(inst.id).toBeDefined();
        expect(inst.id).not.toContain('--');
        expect(inst.id.endsWith('-')).toBe(false);
        expect(inst.id).not.toBe('inst-');
        expect(/^[a-z0-9-]+$/.test(inst.id)).toBe(true);
      });
    });
  });

  it('verifies CCNA 200-301 track has all 7 approved instructors in exact order with clean Latin IDs', () => {
    const ccnaTrack = INITIAL_COURSES.find((c) => c.id === 'cisco-ccna-200-301');
    expect(ccnaTrack).toBeDefined();
    expect(ccnaTrack.instructors.length).toBe(7);

    const expectedInstructors = [
      { id: 'inst-ahmed-salama-ccna', role: 'أساسي' },
      { id: 'inst-shahinaz-elkasrawy-ccna', role: 'بديل معتمد' },
      { id: 'inst-abeer-hosni-ccna', role: 'بديل معتمد' },
      { id: 'inst-ahmed-nazmy-ccna', role: 'بديل معتمد' },
      { id: 'inst-ahmed-hassan-ccna', role: 'بديل معتمد' },
      { id: 'inst-jeremy-it-lab-ccna', role: 'بديل معتمد' },
      { id: 'inst-keith-barker-ccna', role: 'بديل معتمد' }
    ];

    expectedInstructors.forEach((exp, idx) => {
      const inst = ccnaTrack.instructors[idx];
      expect(inst.id).toBe(exp.id);
      expect(inst.role).toBe(exp.role);
      expect(inst.lessons.length).toBeGreaterThan(0);
    });

    expect(ccnaTrack.methodologyNote).toBe('كلها تشرح امتحان CCNA 200-301 — مرتبة حسب شرط المئة درس والساعات');
  });

  it('guarantees zero fake 15:00 placeholder durations across all catalog lessons', () => {
    let fakeDurationCount = 0;
    INITIAL_COURSES.forEach((track) => {
      track.instructors.forEach((inst) => {
        inst.lessons.forEach((l) => {
          if (l.duration === '15:00') {
            fakeDurationCount++;
          }
        });
      });
    });
    expect(fakeDurationCount).toBe(0);
  });
});

describe('Course/Track Object Schema (هيكل بيانات المسارات الأكاديمية والمحاضرين)', () => {
  it('defines valid instructor roles and supported languages', () => {
    expect(INSTRUCTOR_ROLES).toContain('أساسي');
    expect(INSTRUCTOR_ROLES).toContain('بديل معتمد');
    expect(INSTRUCTOR_ROLES).toContain('مكمل');
    expect(INSTRUCTOR_LANGUAGES).toEqual(['AR', 'EN']);
  });

  it('creates and validates a complete academic track conforming to schema', () => {
    const sampleTrackData = {
      id: 'cisco-ccna-200-301',
      title: 'شهادة سيسكو الرسمية لإدارة الشبكات CCNA 200-301',
      domainId: 'networking-cybersecurity',
      domainTitle: 'الشبكات والأمن السيبراني',
      badge: 'المرتبة #1',
      examCode: 'CCNA 200-301',
      methodologyNote: 'يُنصح بدراسة المسار الأساسي وتطبيق تمارين Packet Tracer قبل دخول الامتحان الدولي.',
      instructors: [
        {
          id: 'inst-ahmed-hassan',
          name: 'م. أحمد حسن',
          role: 'أساسي',
          language: 'AR',
          verified: true,
          lessonsCount: 42,
          durationText: '32 ساعة تدريبية',
          note: 'شرح أكاديمي شامل ومحدث لمنهج سيسكو الجديد مع محاكاة المعامل',
          playlistId: 'PLrXX6HqGk5nNxxcc3d4Lg-8hV901',
          channelUrl: 'https://youtube.com/@ahmed-hassan-networks',
          lessons: [
            {
              index: 1,
              videoId: 'wHIdCNIQHpo',
              title: 'مقدمة في أساسيات الشبكات والنموذج المرجعي OSI',
              duration: '22:15'
            },
            {
              index: 2,
              videoId: 'PzOH1v5GaW0',
              title: 'بروتوكولات التوجيه وبناء عناوين IPv4 و IPv6',
              duration: '35:40'
            }
          ]
        },
        {
          id: 'inst-keith-barker',
          name: 'Keith Barker (CBT Nuggets)',
          role: 'بديل معتمد',
          language: 'EN',
          verified: true,
          lessonsCount: 60,
          durationText: '40 ساعة تدريبية',
          note: 'شرح إنجليزي دولي متميز لتعزيز المصطلحات والتدريب على بيئة الاختبار',
          playlistId: 'PLxxxxxxx',
          channelUrl: 'https://youtube.com/@keithbarker',
          lessons: [
            {
              index: 1,
              videoId: 'FOuA_ct11DQ',
              title: 'CCNA Exam Prep & Network Fundamentals',
              duration: '18:20'
            }
          ]
        }
      ]
    };

    const track = createCourseTrack(sampleTrackData);

    expect(track.id).toBe('cisco-ccna-200-301');
    expect(track.title).toBe('شهادة سيسكو الرسمية لإدارة الشبكات CCNA 200-301');
    expect(track.domainId).toBe('networking-cybersecurity');
    expect(track.domainTitle).toBe('الشبكات والأمن السيبراني');
    expect(track.badge).toBe('المرتبة #1');
    expect(track.examCode).toBe('CCNA 200-301');
    expect(track.methodologyNote).toContain('Packet Tracer');

    expect(track.instructors.length).toBe(2);
    expect(track.instructors[0].role).toBe('أساسي');
    expect(track.instructors[0].language).toBe('AR');
    expect(track.instructors[0].verified).toBe(true);
    expect(track.instructors[0].lessonsCount).toBe(42);
    expect(track.instructors[0].lessons.length).toBe(2);
    expect(track.instructors[0].lessons[0].videoId).toBe('wHIdCNIQHpo');

    expect(track.instructors[1].role).toBe('بديل معتمد');
    expect(track.instructors[1].language).toBe('EN');

    // التحقق من توافق الحقول مع واجهات الموقع الحالية
    expect(track.category).toBe('الشبكات والأمن السيبراني');
    expect(track.instructor).toBe('م. أحمد حسن');
    expect(track.youtubeId).toBe('wHIdCNIQHpo');

    // اختبار التحقق من الصحة
    const validationResult = validateCourseTrack(track);
    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors).toEqual([]);
  });

  it('validates required fields and reports errors accurately', () => {
    const invalidTrack = {
      id: '',
      title: '',
      domainId: '',
      domainTitle: '',
      badge: '',
      instructors: [
        {
          id: 'inst-1',
          name: '',
          role: 'غير معتمد',
          language: 'FR',
          verified: 'yes',
          lessonsCount: 'ten',
          durationText: 100,
          lessons: 'not-an-array'
        }
      ]
    };

    const result = validateCourseTrack(invalidTrack);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes('title'))).toBe(true);
    expect(result.errors.some((e) => e.includes('دور غير صالح'))).toBe(true);
    expect(result.errors.some((e) => e.includes('لغة غير صالحة'))).toBe(true);
  });
});

describe('LocalStorage Versioning & Seed Status Synchronization', () => {
  it('updates seed-status.json to reflect 8 categories, 73 courses, and 114 ebooks', () => {
    expect(seedStatus.categoriesCount).toBe(8);
    expect(seedStatus.coursesCount).toBe(73);
    expect(seedStatus.ebooksCount).toBe(114);
    expect(seedStatus.storageKey).toBe('aiprodzone_courses_v8');
    expect(seedStatus.categoriesStorageKey).toBe('aiprodzone_categories_v3');
    expect(seedStatus.ebooksStorageKey).toBe('aiprodzone_ebooks_v6');
    expect(seedStatus.categories.length).toBe(8);
  });

  it('strictly preserves the 114 ebooks library intact', () => {
    expect(EBOOK_GUIDES.length).toBe(114);
  });
});
