import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { INITIAL_COURSES } from '../data/courses';
import { SEED_CATEGORIES } from '../data/categories';
import { EBOOK_GUIDES } from '../data/ebooks';
import { INITIAL_ARTICLES } from '../data/articles';
import { getOverallScore } from '../lib/format';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import {
  createBackupPayload,
  downloadBackupFile,
  restoreBackup,
  validateAndSanitizeBackup
} from '../lib/backup';

const LibraryContext = createContext(null);

const isStringArray = (val) =>
  Array.isArray(val) && val.every((item) => typeof item === 'string');

const isObjectMap = (val) =>
  Boolean(val) && typeof val === 'object' && !Array.isArray(val);

const isCourseArray = (val) =>
  Array.isArray(val) && val.every((item) => Boolean(item) && typeof item.id === 'string');

const isCategoryArray = (val) =>
  Array.isArray(val) && val.every((item) => Boolean(item) && typeof item.id === 'string');

const isEbookArray = (val) =>
  Array.isArray(val) && val.every((item) => Boolean(item) && typeof item.id === 'string');

const isArticleArray = (val) =>
  Array.isArray(val) && val.every((item) => Boolean(item) && typeof item.id === 'string');

// استدعاء مسار إعادة التحقق السحابي في الخلفية (Revalidation)
const triggerRevalidate = async () => {
  try {
    await fetch('/api/revalidate', { method: 'POST' });
  } catch (err) {
    // تجاهل في حالة عدم توفر الاتصال
  }
};

// Props: { children: import('react').ReactNode }
export function LibraryProvider({ children }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const [watchlistIds, setWatchlistIds] = useLocalStorage('aiprodzone_watchlist', [], isStringArray);
  const [completedIds, setCompletedIds] = useLocalStorage('aiprodzone_completed', [], isStringArray);
  const [completedLessons, setCompletedLessons] = useLocalStorage('aiprodzone_completed_lessons_v1', {}, isObjectMap);
  const [userRatings, setUserRatings] = useLocalStorage('aiprodzone_user_ratings', {}, isObjectMap);
  const [customComments, setCustomComments] = useLocalStorage('aiprodzone_custom_comments', {}, isObjectMap);

  // تخزين الأقسام والدروس والكتب مع إمكانية التعديل والترتيب من لوحة التحكم /admin
  const [categoriesList, setCategoriesList] = useLocalStorage(
    'aiprodzone_categories_v3',
    SEED_CATEGORIES,
    isCategoryArray
  );

  const [coursesList, setCoursesList] = useLocalStorage(
    'aiprodzone_courses_v8',
    INITIAL_COURSES,
    isCourseArray
  );

  const [ebooksList, setEbooksList] = useLocalStorage(
    'aiprodzone_ebooks_v6',
    EBOOK_GUIDES,
    isEbookArray
  );

  const [articlesList, setArticlesList] = useLocalStorage(
    'aiprodzone_articles_v1',
    INITIAL_ARTICLES,
    isArticleArray
  );

  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useLocalStorage(
    'aiprodzone_bookmarked_articles',
    [],
    isStringArray
  );

  // دمج التعليقات المخصصة مع الدروس
  const courses = useMemo(() => {
    return coursesList.map((course) => {
      const extraComments = customComments[course.id];
      if (Array.isArray(extraComments) && extraComments.length > 0) {
        return {
          ...course,
          comments: [...extraComments, ...(course.comments || [])]
        };
      }
      return course;
    });
  }, [coursesList, customComments]);

  // إدارة قائمة المشاهدة لاحقاً
  const toggleWatchlist = useCallback(
    (e, courseId) => {
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }
      setWatchlistIds((prev) =>
        prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
      );
    },
    [setWatchlistIds]
  );

  // وضع علامة "مكتمل" للمسار بالكامل
  const toggleCompleted = useCallback(
    (courseId) => {
      setCompletedIds((prev) =>
        prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
      );
    },
    [setCompletedIds]
  );

  // إدارة إكمال الدروس الفردية لكل محاضر
  const toggleLessonCompleted = useCallback(
    (courseId, instructorId, lessonIndex) => {
      const key = `${courseId}_${instructorId}_${lessonIndex}`;
      setCompletedLessons((prev) => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }
        return next;
      });
    },
    [setCompletedLessons]
  );

  const isLessonCompleted = useCallback(
    (courseId, instructorId, lessonIndex) => {
      const key = `${courseId}_${instructorId}_${lessonIndex}`;
      return Boolean(completedLessons[key]);
    },
    [completedLessons]
  );

  const getInstructorCompletedLessonsCount = useCallback(
    (courseId, instructorId) => {
      const prefix = `${courseId}_${instructorId}_`;
      return Object.keys(completedLessons).filter((k) => k.startsWith(prefix) && completedLessons[k]).length;
    },
    [completedLessons]
  );

  // حفظ تقييم المستخدم
  const submitUserRating = useCallback(
    (courseId, scores) => {
      let updated = false;
      setUserRatings((prev) => {
        const existing = prev[courseId];
        if (existing && existing.editCount >= 1) {
          return prev;
        }
        updated = true;
        return {
          ...prev,
          [courseId]: {
            scores: { ...scores },
            overall: getOverallScore(scores),
            editCount: existing ? existing.editCount + 1 : 0
          }
        };
      });
      return updated;
    },
    [setUserRatings]
  );

  // إضافة تعليق
  const addComment = useCallback(
    (courseId, text) => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      const commentObj = {
        id: Date.now(),
        user: 'متعلم في AIProdZone',
        role: 'عضو المنصة',
        time: 'الآن',
        likes: 1,
        text: trimmed
      };
      setCustomComments((prev) => {
        const currentList = prev[courseId] || [];
        return {
          ...prev,
          [courseId]: [commentObj, ...currentList]
        };
      });
      return true;
    },
    [setCustomComments]
  );

  // ==================== عمليات إدارة الدروس (Courses Admin Operations) ====================
  const addCourse = useCallback(
    (newCourseData) => {
      let created = null;
      setCoursesList((prev) => {
        const sameCategory = prev.filter((c) => c.category === newCourseData.category);
        const nextOrder = newCourseData.orderIndex || (sameCategory.length > 0
          ? Math.max(...sameCategory.map((c) => c.orderIndex || c.rankOrder || 0)) + 1
          : 1);

        created = {
          ...newCourseData,
          id: newCourseData.id || `course-${Date.now()}`,
          orderIndex: nextOrder,
          rankOrder: nextOrder,
          youtubeVideoId: newCourseData.youtubeVideoId || newCourseData.youtubeId,
          youtubeId: newCourseData.youtubeId || newCourseData.youtubeVideoId
        };
        return [created, ...prev];
      });
      triggerRevalidate();
      return created;
    },
    [setCoursesList]
  );

  const updateCourse = useCallback(
    (courseId, fields) => {
      setCoursesList((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, ...fields } : c))
      );
      triggerRevalidate();
    },
    [setCoursesList]
  );

  const deleteCourse = useCallback(
    (courseId) => {
      setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
      triggerRevalidate();
    },
    [setCoursesList]
  );

  const reorderCourse = useCallback(
    (courseId, direction) => {
      setCoursesList((prev) => {
        const current = prev.find((c) => c.id === courseId);
        if (!current) return prev;

        const sameCategory = prev
          .filter((c) => c.category === current.category)
          .sort((a, b) => (a.orderIndex || a.rankOrder || 0) - (b.orderIndex || b.rankOrder || 0));

        const idx = sameCategory.findIndex((c) => c.id === courseId);
        if (idx === -1) return prev;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sameCategory.length) return prev;

        const target = sameCategory[targetIdx];
        const currentOrder = current.orderIndex || current.rankOrder || idx + 1;
        const targetOrder = target.orderIndex || target.rankOrder || targetIdx + 1;

        return prev.map((item) => {
          if (item.id === current.id) {
            return { ...item, orderIndex: targetOrder, rankOrder: targetOrder };
          }
          if (item.id === target.id) {
            return { ...item, orderIndex: currentOrder, rankOrder: currentOrder };
          }
          return item;
        });
      });
      triggerRevalidate();
    },
    [setCoursesList]
  );

  // ==================== عمليات إدارة الأقسام (Categories Admin Operations) ====================
  const addCategory = useCallback(
    (newCategory) => {
      setCategoriesList((prev) => {
        const nextOrder = prev.length + 1;
        return [
          ...prev,
          {
            ...newCategory,
            orderIndex: newCategory.orderIndex || nextOrder,
            id: newCategory.id || `cat-${Date.now()}`
          }
        ];
      });
      triggerRevalidate();
    },
    [setCategoriesList]
  );

  const updateCategory = useCallback(
    (categoryId, fields) => {
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, ...fields } : c))
      );
      triggerRevalidate();
    },
    [setCategoriesList]
  );

  const deleteCategory = useCallback(
    (categoryId) => {
      setCategoriesList((prev) => prev.filter((c) => c.id !== categoryId));
      triggerRevalidate();
    },
    [setCategoriesList]
  );

  const reorderCategory = useCallback(
    (categoryId, direction) => {
      setCategoriesList((prev) => {
        const sorted = [...prev].sort((a, b) => a.orderIndex - b.orderIndex);
        const idx = sorted.findIndex((c) => c.id === categoryId);
        if (idx === -1) return prev;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sorted.length) return prev;

        const current = sorted[idx];
        const target = sorted[targetIdx];

        const currentOrder = current.orderIndex;
        const targetOrder = target.orderIndex;

        return prev.map((item) => {
          if (item.id === current.id) return { ...item, orderIndex: targetOrder };
          if (item.id === target.id) return { ...item, orderIndex: currentOrder };
          return item;
        });
      });
      triggerRevalidate();
    },
    [setCategoriesList]
  );

  // ==================== عمليات إدارة الكتب (Ebooks Admin Operations) ====================
  const addEbook = useCallback(
    (newEbook) => {
      setEbooksList((prev) => [
        {
          ...newEbook,
          id: newEbook.id || `ebook-${Date.now()}`,
          sectionOrder: newEbook.sectionOrder || prev.length + 1
        },
        ...prev
      ]);
      triggerRevalidate();
    },
    [setEbooksList]
  );

  const updateEbook = useCallback(
    (ebookId, fields) => {
      setEbooksList((prev) =>
        prev.map((eb) => (eb.id === ebookId ? { ...eb, ...fields } : eb))
      );
      triggerRevalidate();
    },
    [setEbooksList]
  );

  const deleteEbook = useCallback(
    (ebookId) => {
      setEbooksList((prev) => prev.filter((eb) => eb.id !== ebookId));
      triggerRevalidate();
    },
    [setEbooksList]
  );

  const reorderEbook = useCallback(
    (ebookId, direction) => {
      setEbooksList((prev) => {
        const sorted = [...prev].sort((a, b) => (a.sectionOrder || 0) - (b.sectionOrder || 0));
        const idx = sorted.findIndex((e) => e.id === ebookId);
        if (idx === -1) return prev;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sorted.length) return prev;

        const current = sorted[idx];
        const target = sorted[targetIdx];

        const currentOrder = current.sectionOrder || idx + 1;
        const targetOrder = target.sectionOrder || targetIdx + 1;

        return prev.map((item) => {
          if (item.id === current.id) return { ...item, sectionOrder: targetOrder };
          if (item.id === target.id) return { ...item, sectionOrder: currentOrder };
          return item;
        });
      });
      triggerRevalidate();
    },
    [setEbooksList]
  );

  // ==================== عمليات إدارة المقالات التقنية (Articles Operations) ====================
  const toggleBookmarkArticle = useCallback(
    (e, articleId) => {
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }
      setBookmarkedArticleIds((prev) =>
        prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
      );
    },
    [setBookmarkedArticleIds]
  );

  const addArticle = useCallback(
    (newArticle) => {
      let created = null;
      setArticlesList((prev) => {
        created = {
          ...newArticle,
          id: newArticle.id || `article-${Date.now()}`,
          publishedAt: newArticle.publishedAt || new Date().toISOString().split('T')[0],
          readTime: newArticle.readTime || '6 دقائق قراءة',
          sections: Array.isArray(newArticle.sections) ? newArticle.sections : [],
          tags: Array.isArray(newArticle.tags) ? newArticle.tags : [],
          keyTakeaways: Array.isArray(newArticle.keyTakeaways) ? newArticle.keyTakeaways : [],
          relatedCourseIds: Array.isArray(newArticle.relatedCourseIds) ? newArticle.relatedCourseIds : []
        };
        return [created, ...prev];
      });
      triggerRevalidate();
      return created;
    },
    [setArticlesList]
  );

  const updateArticle = useCallback(
    (articleId, fields) => {
      setArticlesList((prev) =>
        prev.map((art) => (art.id === articleId ? { ...art, ...fields } : art))
      );
      triggerRevalidate();
    },
    [setArticlesList]
  );

  const deleteArticle = useCallback(
    (articleId) => {
      setArticlesList((prev) => prev.filter((art) => art.id !== articleId));
      triggerRevalidate();
    },
    [setArticlesList]
  );

  // إعادة التعيين إلى البيانات الأولية المغذاة (Seed Data)
  const resetToSeedData = useCallback(() => {
    setCategoriesList(SEED_CATEGORIES);
    setCoursesList(INITIAL_COURSES);
    setEbooksList(EBOOK_GUIDES);
    setArticlesList(INITIAL_ARTICLES);
    triggerRevalidate();
  }, [setCategoriesList, setCoursesList, setEbooksList, setArticlesList]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      mounted,
      courses,
      categories: categoriesList,
      ebooks: ebooksList,
      articles: articlesList,
      bookmarkedArticleIds,
      selectedCategory,
      setSelectedCategory,
      watchlistIds,
      completedIds,
      completedLessons,
      userRatings,
      toggleWatchlist,
      toggleCompleted,
      toggleLessonCompleted,
      isLessonCompleted,
      getInstructorCompletedLessonsCount,
      submitUserRating,
      addComment,
      addCourse,
      updateCourse,
      deleteCourse,
      reorderCourse,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategory,
      addEbook,
      updateEbook,
      deleteEbook,
      reorderEbook,
      toggleBookmarkArticle,
      addArticle,
      updateArticle,
      deleteArticle,
      resetToSeedData,
      exportBackup: downloadBackupFile,
      getBackupPayload: createBackupPayload,
      restoreBackup,
      validateBackup: validateAndSanitizeBackup
    }),
    [
      theme,
      toggleTheme,
      mounted,
      courses,
      categoriesList,
      ebooksList,
      articlesList,
      bookmarkedArticleIds,
      selectedCategory,
      watchlistIds,
      completedIds,
      completedLessons,
      userRatings,
      toggleWatchlist,
      toggleCompleted,
      toggleLessonCompleted,
      isLessonCompleted,
      getInstructorCompletedLessonsCount,
      submitUserRating,
      addComment,
      addCourse,
      updateCourse,
      deleteCourse,
      reorderCourse,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategory,
      addEbook,
      updateEbook,
      deleteEbook,
      reorderEbook,
      toggleBookmarkArticle,
      addArticle,
      updateArticle,
      deleteArticle,
      resetToSeedData
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}
