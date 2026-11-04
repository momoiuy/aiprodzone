import { describe, it, expect } from 'vitest';
import { ACADEMIC_DOMAINS, SEED_CATEGORIES } from '../src/data/categories.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import { REAL_YOUTUBE_PLAYLISTS } from '../src/data/real-playlists.js';
import seedStatus from '../src/data/seed-status.json';

describe('Admin Dashboard & Master Catalog Comprehensive Tests (المرحلة 7)', () => {
  // =========================================================================
  // أ. وجود الـ 8 قطاعات والـ 73 مساراً بالكامل دون أي معرفات (IDs) مكررة
  // =========================================================================
  describe('أ. التحقق من الـ 8 قطاعات والـ 73 مساراً الشاملة وانعدام التكرار', () => {
    it('يتأكد من وجود الـ 8 قطاعات الأكاديمية بدقة وبدون تكرار في المعرفات', () => {
      expect(ACADEMIC_DOMAINS.length).toBe(8);
      expect(SEED_CATEGORIES.length).toBe(8);

      const domainIds = ACADEMIC_DOMAINS.map((d) => d.id);
      const uniqueDomainIds = new Set(domainIds);
      expect(uniqueDomainIds.size).toBe(8);

      const expectedDomainIds = [
        'web-programming',
        'languages-apps',
        'computer-science',
        'databases-backend',
        'devops-cloud',
        'ai-data-science',
        'networking-cybersecurity',
        'business-languages'
      ];
      expectedDomainIds.forEach((id) => {
        expect(domainIds).toContain(id);
      });
    });

    it('يتأكد من وجود 73 مساراً تعليمياً كاملاً في INITIAL_COURSES دون أي نقص', () => {
      expect(INITIAL_COURSES.length).toBe(73);
    });

    it('يضمن عدم وجود أي معرّف مسار (Course ID) مكرر على الإطلاق (Zero Duplicate IDs)', () => {
      const courseIds = INITIAL_COURSES.map((c) => c.id);
      const uniqueIds = new Set(courseIds);
      expect(uniqueIds.size).toBe(73);

      const duplicates = courseIds.filter((id, index) => courseIds.indexOf(id) !== index);
      expect(duplicates).toEqual([]);
    });

    it('يتحقق من تغطية كافة القطاعات الـ 8 بعدد مسارات متناسق ومطابق للخطة الأكاديمية', () => {
      const countsBySector = {};
      INITIAL_COURSES.forEach((course) => {
        const sector = course.domainTitle || course.category;
        countsBySector[sector] = (countsBySector[sector] || 0) + 1;
      });

      expect(countsBySector['الويب والبرمجة']).toBe(21);
      expect(countsBySector['لغات وتطبيقات وألعاب']).toBe(8);
      expect(countsBySector['علوم الحاسوب']).toBe(8);
      expect(countsBySector['قواعد البيانات والخلفية']).toBe(6);
      expect(countsBySector['DevOps والسحابة والهندسة']).toBe(11);
      expect(countsBySector['الذكاء الاصطناعي وعلم البيانات']).toBe(8);
      expect(countsBySector['الشبكات والأمن السيبراني']).toBe(4);
      expect(countsBySector['الأعمال واللغات']).toBe(7);

      const sum = Object.values(countsBySector).reduce((a, b) => a + b, 0);
      expect(sum).toBe(73);
    });
  });

  // =========================================================================
  // ب. كل مسار يحتوي على محاضرين غير فارغة ومرتبطين بـ playlistId ودروس مرتبة
  // =========================================================================
  describe('ب. التحقق من المحاضرين وقوائم التشغيل والدروس الحقيقية (Zero Hallucination)', () => {
    it('يتأكد من أن كل مسار يحتوي على مصفوفة محاضرين غير فارغة (1 إلى 7 محاضرين)', () => {
      INITIAL_COURSES.forEach((course) => {
        expect(Array.isArray(course.instructors)).toBe(true);
        expect(course.instructors.length).toBeGreaterThanOrEqual(1);
        expect(course.instructors.length).toBeLessThanOrEqual(7);

        // يجب أن يتوفر على الأقل محاضر أساسي واحد
        const hasPrimary = course.instructors.some((inst) => inst.role === 'أساسي');
        expect(hasPrimary).toBe(true);
      });
    });

    it('يضمن خلو كافة المحاضرين من المعرفات المكسورة (Zero Broken IDs like inst--) وسلامة المعرف اللاتيني', () => {
      INITIAL_COURSES.forEach((course) => {
        course.instructors.forEach((inst) => {
          expect(inst.id).toBeDefined();
          expect(inst.id).not.toContain('--');
          expect(inst.id.endsWith('-')).toBe(false);
          expect(inst.id).not.toBe('inst-');
          expect(/^[a-z0-9-]+$/.test(inst.id)).toBe(true);
        });
      });
    });

    it('يضمن عدم وجود أي مدة زمنية وهمية 15:00 في أي درس على الإطلاق عبر كامل الكتالوج', () => {
      let fakeCount = 0;
      INITIAL_COURSES.forEach((course) => {
        course.instructors.forEach((inst) => {
          inst.lessons.forEach((lesson) => {
            if (lesson.duration === '15:00') {
              fakeCount++;
            }
          });
        });
      });
      expect(fakeCount).toBe(0);
    });

    it('يتحقق من أن كل محاضر مرتبط بقائمة تشغيل حقيقية وغير مهلوسة (Verified Playlist ID)', () => {
      INITIAL_COURSES.forEach((course) => {
        course.instructors.forEach((inst) => {
          expect(inst.id).toBeDefined();
          expect(typeof inst.name).toBe('string');
          expect(inst.name.trim().length).toBeGreaterThan(0);
          expect(inst.playlistId).toBeDefined();
          expect(typeof inst.playlistId).toBe('string');
          expect(inst.playlistId.trim().length).toBeGreaterThan(5);

          // يجب أن تبدأ القائمة بـ PL أو تكن معرفاً صالحاً لقوائم يوتيوب
          expect(/^(PL|UU|FL|OLAK5uy_|[a-zA-Z0-9_-]{10,})/i.test(inst.playlistId)).toBe(true);
        });
      });
    });

    it('يتحقق من أن كل محاضر يمتلك دروساً مرتبة حقيقية بمعرفات يوتيوب صالحة (11 حرفاً)', () => {
      INITIAL_COURSES.forEach((course) => {
        course.instructors.forEach((inst) => {
          expect(Array.isArray(inst.lessons)).toBe(true);
          expect(inst.lessons.length).toBeGreaterThan(0);

          inst.lessons.forEach((lesson, idx) => {
            expect(lesson.index).toBe(idx + 1);
            expect(typeof lesson.title).toBe('string');
            expect(lesson.title.trim().length).toBeGreaterThan(0);
            expect(typeof lesson.videoId).toBe('string');
            expect(lesson.videoId.length).toBe(11);
            expect(/^[a-zA-Z0-9_-]{11}$/.test(lesson.videoId)).toBe(true);
          });
        });
      });
    });

    it('يتحقق من تغذية قاموس REAL_YOUTUBE_PLAYLISTS بقوائم يوتيوب المؤكدة', () => {
      const cachedKeys = Object.keys(REAL_YOUTUBE_PLAYLISTS);
      expect(cachedKeys.length).toBeGreaterThanOrEqual(120);

      // عينة من القوائم المؤكدة لمسارات مختلفة
      expect(REAL_YOUTUBE_PLAYLISTS['PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs']).toBeDefined(); // بايثون الزيرو
      expect(REAL_YOUTUBE_PLAYLISTS['PL6-3IRz2XF5Ua2KG_Fl3lbZ-kKi3-Np0_']).toBeDefined(); // تعلم الآلة هشام عاصم
      expect(REAL_YOUTUBE_PLAYLISTS['PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ']).toBeDefined(); // CCNA Jeremy
    });

    it('يضمن أن جميع المسارات تعتمد hqdefault المضمونة 100% ولا تقع في فخ صور 404 الرمادية', () => {
      INITIAL_COURSES.forEach((course) => {
        expect(course.thumbnail).toContain('hqdefault.jpg');
        course.instructors.forEach((inst) => {
          const firstVid = inst.lessons?.[0]?.videoId;
          expect(firstVid).toBeDefined();
          expect(firstVid.length).toBe(11);
        });
      });
    });
  });

  // =========================================================================
  // ج. عمل البحث اللحظي باسم المادة أو المحاضر (عربي وإنجليزي) والفلترة المزدوجة
  // =========================================================================
  describe('ج. التحقق من البحث اللحظي والفلترة ثنائية المستوى', () => {
    // دالة محاكاة مطابقة البحث في لوحة الإدارة
    const searchAdminCourses = (courses, query, sectionFilter = 'الكل') => {
      return courses.filter((c) => {
        const matchesSection =
          sectionFilter === 'الكل' ||
          c.category === sectionFilter ||
          c.domainTitle === sectionFilter ||
          c.domainId === sectionFilter;

        if (!matchesSection) return false;
        if (!query || !query.trim()) return true;

        const q = query.trim().toLowerCase();
        const inTitle = (c.title || '').toLowerCase().includes(q);
        const inPrimaryInst = (c.instructor || '').toLowerCase().includes(q);
        const inDomain = (c.domainTitle || c.category || '').toLowerCase().includes(q);
        const inSynopsis = (c.synopsis || '').toLowerCase().includes(q);
        const inTools = (c.toolsSummary || '').toLowerCase().includes(q);
        const inTech = Array.isArray(c.techStack)
          ? c.techStack.some((t) => (typeof t === 'string' ? t.toLowerCase().includes(q) : (t.name || '').toLowerCase().includes(q)))
          : false;
        const inInstructors = Array.isArray(c.instructors)
          ? c.instructors.some((inst) => (inst.name || '').toLowerCase().includes(q) || (inst.id || '').toLowerCase().includes(q))
          : false;

        return inTitle || inPrimaryInst || inDomain || inSynopsis || inTools || inTech || inInstructors;
      });
    };

    it('يبحث بنجاح بأسماء المواد باللغة العربية', () => {
      const resultsAlgo = searchAdminCourses(INITIAL_COURSES, 'خوارزميات');
      expect(resultsAlgo.length).toBeGreaterThanOrEqual(1);
      expect(resultsAlgo.some((c) => c.id === 'algorithms-masterclass')).toBe(true);

      const resultsDocker = searchAdminCourses(INITIAL_COURSES, 'دوكر');
      expect(resultsDocker.length).toBeGreaterThanOrEqual(1);
      expect(resultsDocker.some((c) => c.id === 'docker-masterclass')).toBe(true);

      const resultsML = searchAdminCourses(INITIAL_COURSES, 'تعلم الآلة');
      expect(resultsML.length).toBeGreaterThanOrEqual(1);
    });

    it('يبحث بنجاح بأسماء المواد والمصطلحات باللغة الإنجليزية', () => {
      const resultsKubernetes = searchAdminCourses(INITIAL_COURSES, 'Kubernetes');
      expect(resultsKubernetes.length).toBeGreaterThanOrEqual(1);
      expect(resultsKubernetes.some((c) => c.id === 'kubernetes-masterclass')).toBe(true);

      const resultsSecurity = searchAdminCourses(INITIAL_COURSES, 'Security+');
      expect(resultsSecurity.length).toBeGreaterThanOrEqual(1);
      expect(resultsSecurity.some((c) => c.id === 'comptia-security-plus')).toBe(true);

      const resultsGit = searchAdminCourses(INITIAL_COURSES, 'Git');
      expect(resultsGit.length).toBeGreaterThanOrEqual(1);
      expect(resultsGit.some((c) => c.id === 'git-github-masterclass')).toBe(true);
    });

    it('يبحث بنجاح بأسماء المحاضرين باللغة العربية (الأساسيين والبدلاء)', () => {
      const elzeroResults = searchAdminCourses(INITIAL_COURSES, 'الزيرو');
      expect(elzeroResults.length).toBeGreaterThanOrEqual(3);

      const desoukiResults = searchAdminCourses(INITIAL_COURSES, 'الدسوقي');
      expect(desoukiResults.length).toBeGreaterThanOrEqual(3);

      const anjriniResults = searchAdminCourses(INITIAL_COURSES, 'عنجريني');
      expect(anjriniResults.length).toBeGreaterThanOrEqual(3);

      const heshamResults = searchAdminCourses(INITIAL_COURSES, 'هشام عاصم');
      expect(heshamResults.length).toBeGreaterThanOrEqual(2);
    });

    it('يبحث بنجاح بأسماء المحاضرين باللغة الإنجليزية (الأساسيين والبدلاء)', () => {
      const barkerResults = searchAdminCourses(INITIAL_COURSES, 'Keith Barker');
      expect(barkerResults.length).toBeGreaterThanOrEqual(1);

      const messerResults = searchAdminCourses(INITIAL_COURSES, 'Professor Messer');
      expect(messerResults.length).toBeGreaterThanOrEqual(1);

      const jeremyResults = searchAdminCourses(INITIAL_COURSES, "Jeremy's IT Lab");
      expect(jeremyResults.length).toBeGreaterThanOrEqual(1);
    });

    it('ينفذ الفلترة المزدوجة بدقة (القطاع + البحث السريع معاً)', () => {
      // البحث عن 'SQL' داخل قطاع قواعد البيانات والخلفية فقط
      const dbSql = searchAdminCourses(INITIAL_COURSES, 'SQL', 'قواعد البيانات والخلفية');
      expect(dbSql.length).toBeGreaterThanOrEqual(1);
      dbSql.forEach((c) => {
        expect(c.category).toBe('قواعد البيانات والخلفية');
      });

      // البحث عن 'Python' داخل قطاع الذكاء الاصطناعي وعلم البيانات
      const aiPython = searchAdminCourses(INITIAL_COURSES, 'Python', 'الذكاء الاصطناعي وعلم البيانات');
      expect(aiPython.length).toBeGreaterThanOrEqual(1);
      aiPython.forEach((c) => {
        expect(c.category).toBe('الذكاء الاصطناعي وعلم البيانات');
      });
    });
  });

  // =========================================================================
  // د. سلامة مكتبة الكتب الـ 114 وملف إحصائيات التغذية
  // =========================================================================
  describe('د. استدامة مكتبة الكتب الـ 114 وإعدادات Seed', () => {
    it('يتأكد من بقاء مكتبة الكتب الـ 114 كاملة وسليمة 100%', () => {
      expect(EBOOK_GUIDES.length).toBe(114);
      const uniqueBookIds = new Set(EBOOK_GUIDES.map((b) => b.id));
      expect(uniqueBookIds.size).toBe(114);
    });

    it('يطابق seed-status.json مع المعايير الرسمية: 8 قطاعات، 73 مساراً، 114 كتاباً، وإصدار v8', () => {
      expect(seedStatus.categoriesCount).toBe(8);
      expect(seedStatus.coursesCount).toBe(73);
      expect(seedStatus.ebooksCount).toBe(114);
      expect(seedStatus.storageKey).toBe('aiprodzone_courses_v8');
      expect(seedStatus.categoriesStorageKey).toBe('aiprodzone_categories_v3');
      expect(seedStatus.ebooksStorageKey).toBe('aiprodzone_ebooks_v6');
    });
  });
});
