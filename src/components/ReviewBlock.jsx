'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Check, X, Copy, MessageSquare, Send } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

// Props: { course: object }
export default function ReviewBlock({ course }) {
  const { addComment } = useLibrary();

  const [copyStatus, setCopyStatus] = useState('idle');
  const [newComment, setNewComment] = useState('');

  // معالجة دفاعية مرنة لحقول المراجعة والتحليل لتجنب أي أخطاء runtime
  const review = course?.review || {
    verdictBox: course?.methodologyNote || course?.oneLineVerdict || course?.title || 'مسار تعليمي متكامل معتمد.',
    strengths: 'تغطية تفاعلية ممتازة، تنظيم أكاديمي متسلسل، وتطبيقات عملية تواكب أحدث المعايير التقنية.',
    limitations: 'يُنصح بتطبيق التمارين خطوة بخطوة بعد كل درس ومراجعة المفاهيم لترسيخ التعلم.',
    deepAnalysis: course?.synopsis || course?.methodologyNote || course?.title || 'شرح ممنهج يبدأ من المفاهيم الأساسية حتى التطبيق العملي الكامل.'
  };

  const promptBlueprint =
    course?.promptBlueprint ||
    `خطة تطبيق عملية لدراسة مسار: ${course?.title || ''}\n1. متابعة الدرس وتدوين الملاحظات البرمجية والعملية.\n2. تنفيذ التحدي العملي ومحاكاة المعامل والتأكد من صحة النتائج.\n3. الانتقال للدرس التالي وتثبيت المفاهيم المكتسبة.`;

  const comments = Array.isArray(course?.comments) ? course.comments : [];

  const handleCopyPrompt = async (text) => {
    let copied = false;

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        copied = false;
      }
    }

    setCopyStatus(copied ? 'copied' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (course?.id && addComment(course.id, newComment)) {
      setNewComment('');
    }
  };

  return (
    <>
      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-base sm:text-lg font-extrabold text-text-heading">
              مراجعة وخلاصة AIProdZone المنهجية
            </h2>
          </div>
          <Chip tone="neutral">تحليل تعليمي موثق</Chip>
        </div>

        <p className="text-sm sm:text-base font-medium leading-relaxed text-text">
          {review.verdictBox}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-surface-2 space-y-1.5">
            <div className="text-xs font-extrabold text-text-heading">
              ✓ أبرز نقاط القوة في الشرح
            </div>
            <p className="text-xs leading-relaxed text-text-muted">{review.strengths}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-surface-2 space-y-1.5">
            <div className="text-xs font-extrabold text-text-heading">
              △ متطلبات وملاحظات قبل البدء
            </div>
            <p className="text-xs leading-relaxed text-text-muted">{review.limitations}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-extrabold text-text-heading">
            الخلاصة العميقة وخطة التطبيق
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-text-muted">
            {review.deepAnalysis}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-text-heading">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              الأمر التطبيقي الجاهز للنسخ (Prompt / قالب العمل)
            </span>
            <Button
              variant="secondary"
              onClick={() => {
                void handleCopyPrompt(promptBlueprint);
              }}
              className="px-2.5 py-1"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span>تم النسخ!</span>
                </>
              ) : copyStatus === 'error' ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>تعذّر النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                  <span>نسخ القالب</span>
                </>
              )}
            </Button>
          </div>
          <p
            dir="auto"
            className="text-xs font-mono leading-relaxed p-2.5 rounded-lg border border-border bg-surface text-text whitespace-pre-line"
          >
            {promptBlueprint}
          </p>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2 text-text-heading">
          <MessageSquare className="w-4 h-4 text-text-muted" />
          <span>أسئلة وملاحظات المتعلمين ({comments.length})</span>
        </h3>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شارك تجربتك بعد تطبيق هذا الدرس أو اطرح سؤالك..."
            className="flex-1 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-border bg-surface-2 text-text placeholder:text-text-muted focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          />
          <Button variant="primary" type="submit" className="px-4 py-2.5 shrink-0">
            <Send className="w-3.5 h-3.5 text-accent-ink" />
            <span>إرسال</span>
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          {comments.length === 0 ? (
            <p className="text-xs text-text-muted">
              كن أول من يشارك تطبيقه العملي أو ملاحظاته حول هذا الدرس.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border border-border bg-surface-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-heading">{c.user}</span>
                    <span className="text-[11px] text-text-muted">• {c.role}</span>
                  </div>
                  <span className="text-text-muted">{c.time}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-text">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}
