// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest';

// إعداد بيئة تخزين متصفح افتراضية (Browser Storage Environment Mock) لاختبارات Node
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(i) {
    return Object.keys(this.store)[i] || null;
  }
}

const mockStorage = new LocalStorageMock();

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: mockStorage,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  };
} else {
  Object.defineProperty(globalThis.window, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true
  });
}

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
});

if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent {
    constructor(event, params) {
      this.type = event;
      this.detail = params?.detail;
    }
  };
}

if (typeof globalThis.Event === 'undefined') {
  globalThis.Event = class Event {
    constructor(type) {
      this.type = type;
    }
  };
}

import {
  getStorageItem,
  setStorageItem,
  getRawStorageString,
  setRawStorageString,
  removeStorageItem,
  isStorageAvailable,
  clearMemoryFallback,
  LEARNER_STORAGE_KEYS,
  getLocalStorageSafely
} from '../src/lib/storage';
import {
  BACKUP_VERSION,
  getBackupFilename,
  createBackupPayload,
  validateAndSanitizeBackup,
  restoreBackup
} from '../src/lib/backup';

describe('Safe Storage Wrapper & Resilience Layer (تحصين التخزين المحلي)', () => {
  beforeEach(() => {
    mockStorage.clear();
    clearMemoryFallback();
    vi.restoreAllMocks();
  });

  describe('1. معالجة البيانات التالفة وحالات عدم وجود بيانات (Corrupted Data & Null Safety)', () => {
    it('يعيد القيمة البديلة (fallback) بأمان عند وجود JSON تالف دون إلقاء أي استثناء أو تعطل الواجهة', () => {
      mockStorage.setItem('corrupted_key', '{"unclosed_json: true, ...');

      const result = getStorageItem('corrupted_key', { safe: true });
      expect(result).toEqual({ safe: true });
    });

    it('يعيد القيمة البديلة عند قراءة مفتاح غير موجود (null key)', () => {
      const result = getStorageItem('non_existent_key', ['default']);
      expect(result).toEqual(['default']);
    });

    it('يرفض البيانات التي لا تطابق دالة التحقق (Validator) ويعيد القيمة البديلة بأمان', () => {
      mockStorage.setItem('invalid_type_key', JSON.stringify({ notAnArray: true }));

      const isArrayValidator = (val) => Array.isArray(val);
      const result = getStorageItem('invalid_type_key', ['fallback_list'], isArrayValidator);

      expect(result).toEqual(['fallback_list']);
    });

    it('يقبل البيانات عندما تجتاز دالة التحقق بنجاح', () => {
      const validList = ['course-1', 'course-2'];
      mockStorage.setItem('valid_key', JSON.stringify(validList));

      const isArrayValidator = (val) => Array.isArray(val);
      const result = getStorageItem('valid_key', [], isArrayValidator);

      expect(result).toEqual(validList);
    });
  });

  describe('2. الحماية ضد QuotaExceededError واستثناءات الذاكرة الممتلئة', () => {
    it('يعالج استثناء QuotaExceededError بأمان دون رمي خطأ ويحفظ البيانات في مخزن الذاكرة المؤقت', () => {
      const setItemSpy = vi.spyOn(mockStorage, 'setItem').mockImplementation(() => {
        const quotaError = new DOMException('The quota has been exceeded.', 'QuotaExceededError');
        throw quotaError;
      });

      // محاولة حفظ بيانات أثناء امتلاء الذاكرة
      const saved = setStorageItem('test_quota_key', { progress: 85 });

      // setStorageItem يعيد false للإشارة إلى تعذر الكتابة في التخزين الدائم
      expect(saved).toBe(false);

      // ولكن القراءة في نفس الجلسة تنجح عبر مخزن الذاكرة الحي (Resilient Memory Fallback)
      const readVal = getStorageItem('test_quota_key', null);
      expect(readVal).toEqual({ progress: 85 });

      setItemSpy.mockRestore();
    });

    it('يتعامل بسلاسة مع الكائنات الدائرية غير القابلة للتحويل إلى JSON', () => {
      const circularObj = {};
      circularObj.self = circularObj;

      const success = setStorageItem('circular_key', circularObj);
      expect(success).toBe(false);
    });
  });

  describe('3. الحماية ضد SecurityError ووضع التصفح الخفي (Safari Private Mode)', () => {
    it('يعمل getStorageItem و setStorageItem بأمان عبر مخزن الذاكرة عند حظر localStorage تماماً', () => {
      const getItemSpy = vi.spyOn(mockStorage, 'getItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });
      const setItemSpy = vi.spyOn(mockStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });

      // حفظ قيمة في وضع الحظر
      setStorageItem('private_mode_key', ['saved_in_memory']);

      // استرجاع القيمة من الذاكرة دون أي استثناء
      const retrieved = getStorageItem('private_mode_key', []);
      expect(retrieved).toEqual(['saved_in_memory']);

      getItemSpy.mockRestore();
      setItemSpy.mockRestore();
    });

    it('يتحقق isStorageAvailable بدقة من حالة توفر التخزين المحلي', () => {
      expect(isStorageAvailable()).toBe(true);

      const setItemSpy = vi.spyOn(mockStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage is disabled');
      });

      expect(isStorageAvailable()).toBe(false);
      setItemSpy.mockRestore();
    });

    it('يحذف العناصر بأمان من كل من localStorage والذاكرة المؤقتة', () => {
      setStorageItem('key_to_remove', { data: 123 });
      expect(getStorageItem('key_to_remove', null)).toEqual({ data: 123 });

      removeStorageItem('key_to_remove');
      expect(getStorageItem('key_to_remove', null)).toBe(null);
    });
  });

  describe('4. معالجة النصوص الخام (Raw Strings)', () => {
    it('يحفظ ويسترجع النصوص الخام بدقة وأمان', () => {
      setRawStorageString('raw_theme_key', 'dark');
      expect(getRawStorageString('raw_theme_key')).toBe('dark');

      setRawStorageString('raw_theme_key', 'light');
      expect(getRawStorageString('raw_theme_key')).toBe('light');
    });

    it('يعيد القيمة الافتراضية للنص الخام عند عدم وجوده', () => {
      expect(getRawStorageString('unknown_raw_key', 'default_theme')).toBe('default_theme');
    });
  });
});

describe('Learner Portfolio Backup & Restore JSON Engine (تصدير واستيراد التقدم)', () => {
  beforeEach(() => {
    mockStorage.clear();
    clearMemoryFallback();
    vi.restoreAllMocks();
  });

  describe('1. تصدير محفظة التعلم الكاملة (Export JSON)', () => {
    it('يجمع كافة بيانات المتعلم الحالية من مفاتيح localStorage الثابتة بصيغة قياسية', () => {
      // إعداد بيانات تجريبية للمتعلم
      setStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, ['web-fullstack-course', 'python-ai-track']);
      setStorageItem(LEARNER_STORAGE_KEYS.COMPLETED, ['git-github-mastery']);
      setStorageItem(LEARNER_STORAGE_KEYS.COMPLETED_LESSONS, {
        'web-fullstack-course_inst-1_0': true,
        'web-fullstack-course_inst-1_1': true
      });
      setStorageItem(LEARNER_STORAGE_KEYS.USER_RATINGS, {
        'web-fullstack-course': {
          scores: { depth: 9.8, practical: 9.5, freshness: 9.9, production: 9.7 },
          overall: 9.7,
          editCount: 1
        }
      });
      setStorageItem(LEARNER_STORAGE_KEYS.CUSTOM_COMMENTS, {
        'web-fullstack-course': [
          { id: 101, user: 'أحمد', role: 'متعلم', time: 'منذ يوم', likes: 3, text: 'شرح ممتاز جداً' }
        ]
      });
      setStorageItem(LEARNER_STORAGE_KEYS.BOOKMARKED_ARTICLES, ['future-of-ai-agents']);
      setStorageItem(LEARNER_STORAGE_KEYS.TICKETS, [
        { id: 'TICK-1', subject: 'استفسار عن الشهادة', message: 'كيف أحصل عليها؟', status: 'received' }
      ]);
      setRawStorageString(LEARNER_STORAGE_KEYS.THEME, 'dark');

      const payload = createBackupPayload();

      // التحقق من الحقول الإلزامية المطلوبة
      expect(payload.version).toBe('1.0');
      expect(typeof payload.exportedAt).toBe('string');
      expect(new Date(payload.exportedAt).toString()).not.toBe('Invalid Date');
      expect(payload.platform).toBe('AIProdZone');

      // التحقق من البيانات المستخرجة
      expect(payload.data.watchlist).toEqual(['web-fullstack-course', 'python-ai-track']);
      expect(payload.data.completedCourses).toEqual(['git-github-mastery']);
      expect(payload.data.completedLessons['web-fullstack-course_inst-1_0']).toBe(true);
      expect(payload.data.userRatings['web-fullstack-course'].overall).toBe(9.7);
      expect(payload.data.customComments['web-fullstack-course'][0].text).toBe('شرح ممتاز جداً');
      expect(payload.data.bookmarkedArticles).toEqual(['future-of-ai-agents']);
      expect(payload.data.tickets[0].id).toBe('TICK-1');
      expect(payload.data.theme).toBe('dark');

      // التحقق من ملخص الأرقام
      expect(payload.summary.watchlistCount).toBe(2);
      expect(payload.summary.completedCoursesCount).toBe(1);
      expect(payload.summary.completedLessonsCount).toBe(2);
      expect(payload.summary.userRatingsCount).toBe(1);
      expect(payload.summary.customCommentsCount).toBe(1);
      expect(payload.summary.bookmarkedArticlesCount).toBe(1);
      expect(payload.summary.ticketsCount).toBe(1);
    });

    it('يولد اسم الملف بالصيغة المعيارية aiprodzone-backup-YYYY-MM-DD.json', () => {
      const fixedDate = new Date(2026, 10, 4); // 2026-11-04
      const filename = getBackupFilename(fixedDate);
      expect(filename).toBe('aiprodzone-backup-2026-11-04.json');
    });
  });

  describe('2. التحقق الصارم والتطهير الأمني للنسخة الاحتياطية (Validation & Sanitization)', () => {
    it('يرفض النصوص التي لا تتبع صيغة JSON الصحيحة مع رسالة خطأ واضحة', () => {
      const invalidJson = '<html><body>Not a json</body></html>';
      const result = validateAndSanitizeBackup(invalidJson);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('JSON');
    });

    it('يرفض الملفات الخالية أو غير الكائنية (null, array, primitive)', () => {
      expect(validateAndSanitizeBackup('').valid).toBe(false);
      expect(validateAndSanitizeBackup(null).valid).toBe(false);
      expect(validateAndSanitizeBackup('[]').valid).toBe(false);
      expect(validateAndSanitizeBackup('"just a string"').valid).toBe(false);
    });

    it('يرفض الملفات التي لا تحتوي على رقم إصدار (version) متوافق', () => {
      const noVersion = JSON.stringify({ platform: 'AIProdZone', data: {} });
      const resultNoVersion = validateAndSanitizeBackup(noVersion);
      expect(resultNoVersion.valid).toBe(false);
      expect(resultNoVersion.error).toContain('إصدار');

      const wrongVersion = JSON.stringify({ version: '9.0', data: {} });
      const resultWrong = validateAndSanitizeBackup(wrongVersion);
      expect(resultWrong.valid).toBe(false);
      expect(resultWrong.error).toContain('غير مدعوم');
    });

    it('يطهر قائمة المحفوظات ويزيل العناصر غير النصية أو الفارغة', () => {
      const rawData = {
        version: '1.0',
        data: {
          watchlist: ['course-1', null, 1234, '  course-2  ', '', 'course-1']
        }
      };

      const result = validateAndSanitizeBackup(rawData);
      expect(result.valid).toBe(true);
      expect(result.sanitizedData.watchlist).toEqual(['course-1', 'course-2']);
    });

    it('يحمي ضد محاولات Prototype Pollution', () => {
      const maliciousData = {
        version: '1.0',
        data: {
          completedLessons: {
            '__proto__': { admin: true },
            'constructor': { hack: true },
            'valid-course_inst-1_0': true
          }
        }
      };

      const result = validateAndSanitizeBackup(maliciousData);
      expect(result.valid).toBe(true);
      expect(result.sanitizedData.completedLessons['__proto__']).toBeUndefined();
      expect(result.sanitizedData.completedLessons['constructor']).toBeUndefined();
      expect(result.sanitizedData.completedLessons['valid-course_inst-1_0']).toBe(true);
    });

    it('يطهر النصوص ويزيل وسوم HTML و JavaScript الخبيثة مع الحفاظ على النص العربي', () => {
      const xssData = {
        version: '1.0',
        data: {
          customComments: {
            'course-test': [
              {
                id: 1,
                user: '<script>alert("hack")</script>محمد علي',
                role: 'طالب',
                text: 'شرح ممتاز <b>جداً</b> ومفيد <img src=x onerror=alert(1)>'
              }
            ]
          }
        }
      };

      const result = validateAndSanitizeBackup(xssData);
      expect(result.valid).toBe(true);
      const comment = result.sanitizedData.customComments['course-test'][0];
      expect(comment.user).toBe('محمد علي');
      expect(comment.text).toBe('شرح ممتاز جداً ومفيد');
    });

    it('يضبط ويحصر قيم التقييمات في النطاق الصحيح (0 إلى 10)', () => {
      const outOfRangeRatings = {
        version: '1.0',
        data: {
          userRatings: {
            'course-1': {
              scores: { depth: 15.5, practical: -3, freshness: 9.85, production: 'notANumber' },
              overall: 20
            }
          }
        }
      };

      const result = validateAndSanitizeBackup(outOfRangeRatings);
      expect(result.valid).toBe(true);
      const rating = result.sanitizedData.userRatings['course-1'];
      expect(rating.scores.depth).toBe(10);
      expect(rating.scores.practical).toBe(0);
      expect(rating.scores.freshness).toBe(9.9);
      expect(rating.scores.production).toBe(0);
      expect(rating.overall).toBe(10);
    });
  });

  describe('3. استعادة النسخة الاحتياطية وتحديث الواجهة (Restore Engine)', () => {
    it('يستعيد البيانات الصالحة إلى localStorage بنجاح ويطلق حدث المزامنة', () => {
      let syncDispatched = false;
      const originalDispatch = globalThis.window.dispatchEvent;
      globalThis.window.dispatchEvent = vi.fn((e) => {
        if (e?.detail?.source === 'backup_restore') {
          syncDispatched = true;
        }
        return true;
      });

      const validBackup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          watchlist: ['restored-course-1'],
          completedCourses: ['restored-course-2'],
          completedLessons: { 'restored-course-1_inst-1_0': true },
          userRatings: {
            'restored-course-1': {
              scores: { depth: 9.5, practical: 9.5, freshness: 9.5, production: 9.5 },
              overall: 9.5,
              editCount: 0
            }
          },
          customComments: {},
          bookmarkedArticles: ['restored-article-1'],
          tickets: [],
          theme: 'dark'
        }
      };

      const restoreResult = restoreBackup(JSON.stringify(validBackup));
      expect(restoreResult.success).toBe(true);
      expect(restoreResult.message).toContain('بنجاح');
      expect(syncDispatched).toBe(true);

      const watchlist = getStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, []);
      expect(watchlist).toEqual(['restored-course-1']);

      const completed = getStorageItem(LEARNER_STORAGE_KEYS.COMPLETED, []);
      expect(completed).toEqual(['restored-course-2']);

      const lessons = getStorageItem(LEARNER_STORAGE_KEYS.COMPLETED_LESSONS, {});
      expect(lessons['restored-course-1_inst-1_0']).toBe(true);

      globalThis.window.dispatchEvent = originalDispatch;
    });

    it('لا يعبث بالبيانات الحالية في التخزين عند فشل استيراد ملف غير صالح', () => {
      setStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, ['original-course-safe']);

      const invalidFile = '{"version": "2.0", "corrupted": true}';
      const restoreResult = restoreBackup(invalidFile);

      expect(restoreResult.success).toBe(false);
      expect(restoreResult.error).toBeDefined();

      const watchlist = getStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, []);
      expect(watchlist).toEqual(['original-course-safe']);
    });
  });
});
