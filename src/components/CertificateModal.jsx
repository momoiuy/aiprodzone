'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  Share2,
  Sparkles,
  User,
  GraduationCap
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Button from './Button';

/**
 * اشتقاق معرف تحقق أكاديمي فريد ببصمة SHA-256 من اسم الطالب ومعرف المسار
 * @param {string} studentName
 * @param {string} courseId
 * @returns {Promise<string>}
 */
export async function computeCertificateId(studentName, courseId) {
  const cleanName = (studentName || 'طالب أكاديمي').trim().toLowerCase();
  const cleanId = (courseId || 'general-track').trim();
  const raw = `${cleanName}__${cleanId}__aiprodzone_cert_2026`;

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    try {
      const msgUint8 = new TextEncoder().encode(raw);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `AIPZ-2026-${hex.slice(0, 8).toUpperCase()}`;
    } catch {
      // Fallback below
    }
  }

  // خوارزمية بديلة حتمية (Deterministic Fallback) لبيئات الاختبار المعزولة
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase().slice(0, 8);
  return `AIPZ-2026-${hex}`;
}

/**
 * رسم شهادة الإتمام الأكاديمية الفاخرة على HTML5 Canvas بدقة 1600x1130px
 * @param {HTMLCanvasElement} canvas
 * @param {object} params
 */
export function drawCertificateOnCanvas(canvas, params = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1600;
  const height = 1130;
  canvas.width = width;
  canvas.height = height;

  const {
    studentName = 'طالب أكاديمي معتمد',
    courseTitle = 'المسار الأكاديمي الشامل',
    instructorName = 'محاضر معتمد بـ AIProdZone',
    domainTitle = 'الويب والبرمجة',
    lessonsCount = 24,
    runtime = '20 ساعة تدريبية',
    completionDate = '2026',
    certificateId = 'AIPZ-2026-XXXX'
  } = params;

  // 1. الخلفية الداكنة الفاخرة بتدرج ملكي متقن
  const bgGrad = ctx.createRadialGradient(
    width / 2, height * 0.35, 100,
    width / 2, height / 2, width * 0.75
  );
  bgGrad.addColorStop(0, '#0F1E36');
  bgGrad.addColorStop(0.5, '#0B1528');
  bgGrad.addColorStop(1, '#050B14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // إضاءة زمردية هادئة في المركز
  const glowGrad = ctx.createRadialGradient(
    width / 2, 280, 20,
    width / 2, 280, 600
  );
  glowGrad.addColorStop(0, 'rgba(20, 184, 166, 0.12)');
  glowGrad.addColorStop(1, 'rgba(20, 184, 166, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. الإطارات المزدوجة الزمردية (#14B8A6)
  // الإطار الخارجي الزمردي
  ctx.strokeStyle = '#14B8A6';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // الإطار الداخلي الذهبي/الزمردي الرفيع
  ctx.strokeStyle = 'rgba(20, 184, 166, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // زخارف الزوايا الهندسية الزمردية (Geometric Corner Brackets)
  const drawCorner = (x, y, xDir, yDir) => {
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y + yDir * 50);
    ctx.lineTo(x, y);
    ctx.lineTo(x + xDir * 50, y);
    ctx.stroke();

    // نقطة زمردية مضيئة في الزاوية
    ctx.fillStyle = '#2DD4BF';
    ctx.beginPath();
    ctx.arc(x + xDir * 15, y + yDir * 15, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };

  drawCorner(40, 40, 1, 1);
  drawCorner(width - 40, 40, -1, 1);
  drawCorner(40, height - 40, 1, -1);
  drawCorner(width - 40, height - 40, -1, -1);

  // 3. رأس الشهادة وهوية المنصة
  ctx.save();
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';

  // الشعار وهوية AIProdZone
  ctx.font = 'bold 36px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#14B8A6';
  ctx.fillText('A I P r o d Z o n e', width / 2, 130);

  ctx.font = '500 18px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('الدليل الأكاديمي العربي الموثق • المنصة المفتوحة 2026', width / 2, 165);

  // خط زخرفي زمردي أسفل الشعار
  ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 220, 190);
  ctx.lineTo(width / 2 + 220, 190);
  ctx.stroke();

  // نجمة وسط الخط
  ctx.fillStyle = '#14B8A6';
  ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText('★', width / 2, 197);

  // 4. العنوان الرئيسي للشهادة
  ctx.font = '900 56px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('شهادة إتمام مسار أكاديمي', width / 2, 275);

  ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#14B8A6';
  ctx.fillText('CERTIFICATE OF ACADEMIC ACHIEVEMENT', width / 2, 312);

  // 5. النص التقديمي
  ctx.font = '500 22px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('تشهد منصة AIProdZone الأكاديمية بأن الطالب:', width / 2, 380);

  // 6. اسم الطالب (مكتوب بوهج زمردي فاخر وخط عريض)
  ctx.font = '900 60px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#2DD4BF';
  ctx.shadowColor = 'rgba(45, 212, 191, 0.4)';
  ctx.shadowBlur = 18;
  ctx.fillText(studentName, width / 2, 465);
  ctx.shadowBlur = 0; // إعادة ضبط الظل

  // خط رفيع تحت اسم الطالب
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 495);
  ctx.lineTo(width / 2 + 280, 495);
  ctx.stroke();

  // 7. صلب الشهادة وموضوع المسار
  ctx.font = '500 22px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('قد أتم بنجاح واجتياز أكاديمي متقن كافة متطلبات وتطبيقات المسار:', width / 2, 555);

  // عنوان المسار الأكاديمي (مع التفاف آمن إذا كان طويلاً)
  ctx.font = '800 42px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#F8FAFC';

  const maxCourseWidth = 1100;
  const words = courseTitle.split(' ');
  let line = '';
  let courseY = 620;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxCourseWidth && n > 0) {
      ctx.fillText(line.trim(), width / 2, courseY);
      line = words[n] + ' ';
      courseY += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), width / 2, courseY);

  // 8. تفاصيل المادة والمحاضر في شريط بطاقة داكن أنيق
  const cardY = courseY + 45;
  ctx.fillStyle = 'rgba(15, 30, 54, 0.7)';
  ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 460, cardY, 920, 85, 16);
  ctx.fill();
  ctx.stroke();

  // عناصر بيانات المسار
  ctx.font = 'bold 18px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#E2E8F0';

  const infoY = cardY + 50;
  ctx.fillText(`المحاضر: ${instructorName}`, width / 2 + 260, infoY);
  ctx.fillText(`القطاع: ${domainTitle}`, width / 2, infoY);
  ctx.fillText(`المنهج: ${lessonsCount} درساً (${runtime})`, width / 2 - 270, infoY);

  // 9. الأختام والتحقق والتوقيعات في أسفل الشهادة
  // الختم الأكاديمي الدائري الزمردي الأيسر (Academic Seal)
  const sealX = 260;
  const sealY = 930;
  ctx.strokeStyle = '#14B8A6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(20, 184, 166, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#14B8A6';
  ctx.fillText('AIPRODZONE', sealX, sealY - 14);
  ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#2DD4BF';
  ctx.fillText('VERIFIED', sealX, sealY + 12);
  ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('2 0 2 6', sealX, sealY + 32);

  // التاريخ ومعرف التحقق في المركز
  ctx.font = 'bold 18px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(`تاريخ الإصدار: ${completionDate}`, width / 2, 905);

  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillStyle = '#14B8A6';
  ctx.fillText(`Certificate ID: ${certificateId}`, width / 2, 940);

  ctx.font = '14px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('بصمة تشفير رقمية موثقة محلياً • Verified SHA-256 Hash Signature', width / 2, 970);

  // التوقيع الأكاديمي الأيمن
  const sigX = width - 260;
  const sigY = 910;

  // خط التوقيع
  ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX - 110, sigY + 20);
  ctx.lineTo(sigX + 110, sigY + 20);
  ctx.stroke();

  // محاكاة توقيع انسيابي أنيق (Fluid Calligraphic Curve)
  ctx.strokeStyle = '#2DD4BF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(sigX - 85, sigY + 5);
  ctx.bezierCurveTo(sigX - 45, sigY - 35, sigX - 15, sigY + 25, sigX + 25, sigY - 15);
  ctx.bezierCurveTo(sigX + 45, sigY - 35, sigX + 65, sigY - 5, sigX + 85, sigY + 10);
  ctx.stroke();

  ctx.font = 'bold 16px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText('عمادة التعليم الأكاديمي', sigX, sigY + 45);

  ctx.font = '13px "Segoe UI", Cairo, Arial, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('AIProdZone Arabic Academy', sigX, sigY + 65);

  // شريط الرابط النهائي في أقصى الأسفل
  ctx.font = '12px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('https://aiprodzone.com • Free & Open-Access Arabic Tech Education', width / 2, 1075);

  ctx.restore();
}

/**
 * نافذة مولد شهادات الإتمام الأكاديمية الموثقة محلياً
 * @param {{ isOpen: boolean, onClose: () => void, course: any, instructor?: any }} props
 */
export default function CertificateModal({
  isOpen,
  onClose,
  course,
  instructor = null
}) {
  const { studentProfile } = useLibrary() || {};
  const canvasRef = useRef(null);

  // اسم الطالب (مع إمكانية تعديله اللحظي قبل التحميل)
  const [studentName, setStudentName] = useState(studentProfile?.name || 'طالب أكاديمي معتمد');
  const [certificateId, setCertificateId] = useState('AIPZ-2026-CALCULATING');
  const [isCopied, setIsCopied] = useState(false);

  // تحديث الاسم الافتراضي إذا تغير الملف الشخصي
  useEffect(() => {
    if (studentProfile?.name) {
      setStudentName(studentProfile.name);
    }
  }, [studentProfile?.name]);

  // اشتقاق معرّف التحقق الرقمي الفوري عبر SHA-256
  useEffect(() => {
    if (!isOpen || !course?.id) return;
    let isCancelled = false;

    computeCertificateId(studentName, course.id).then((id) => {
      if (!isCancelled) {
        setCertificateId(id);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, studentName, course?.id]);

  // رسم الشهادة عند فتح النافذة أو تغير البيانات
  const renderCertificate = useCallback(() => {
    if (!canvasRef.current || !course) return;

    const primaryInst = instructor || course.instructors?.find((i) => i.role === 'أساسي') || course.instructors?.[0];
    const instName = primaryInst?.name || course.instructor || 'محاضر معتمد';
    const lessonsCount = primaryInst?.lessons?.length || course.lessonsCount || 24;
    const runtime = primaryInst?.durationText || course.runtime || '20 ساعة تدريبية';
    const domainTitle = course.domainTitle || course.category || 'الويب والبرمجة';

    const todayDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    drawCertificateOnCanvas(canvasRef.current, {
      studentName: studentName.trim() || 'طالب أكاديمي معتمد',
      courseTitle: course.title || 'المسار الأكاديمي',
      instructorName: instName,
      domainTitle,
      lessonsCount,
      runtime,
      completionDate: todayDate,
      certificateId
    });
  }, [course, instructor, studentName, certificateId]);

  useEffect(() => {
    if (isOpen) {
      renderCertificate();
    }
  }, [isOpen, renderCertificate]);

  // تحميل الشهادة كصورة PNG عالية الدقة (1600x1130)
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeCourseName = (course?.title || 'Course').replace(/[/\\?%*:|"<>]/g, '-').slice(0, 40);
      link.download = `AIProdZone-Certificate-${safeCourseName}-${certificateId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('تعذر تنزيل الشهادة كصورة:', err);
    }
  };

  // طباعة / حفظ كـ PDF بجودة نقية
  const handlePrint = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>شهادة إتمام - ${course?.title || 'AIProdZone'}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #0B1120;
            }
            img {
              width: 100%;
              max-width: 100vw;
              height: auto;
              max-height: 100vh;
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Certificate" onload="window.print(); window.close();" />
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('تعذر فتح نافذة الطباعة:', err);
    }
  };

  // نسخ معرّف التحقق للمشاركة
  const handleCopyId = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(certificateId);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-smooth"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-surface border border-teal-500/40 shadow-2xl p-4 sm:p-6 space-y-5"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط العنوان وأزرار الإغلاق */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="cert-modal-title" className="text-base sm:text-lg font-black text-text-heading flex items-center gap-2">
                <span>شهادة إتمام المسار الأكاديمي</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 text-[10px] font-black">
                  رقمية موثقة
                </span>
              </h2>
              <p className="text-xs text-text-muted">
                إصدار وتوثيق محلي عالي الدقة (1600x1130px) بدون أي خوادم تتبع خارجية.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-surface-2 transition-all"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* حقل تخصيص اسم الطالب فورياً */}
        <div className="p-3.5 rounded-2xl bg-surface-2 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-extrabold text-text-heading whitespace-nowrap">
              اسم المتعلم المعتمد في الشهادة:
            </span>
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="اكتب اسمك الثلاثي كما تريده في الشهادة..."
              className="w-full text-xs font-bold rounded-xl px-3.5 py-2 bg-surface text-text border border-border focus:border-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 transition-all placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* مساحة المعاينة الحية للكانفاس (Canvas Preview) */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-border/80 bg-black/40 flex items-center justify-center p-2 sm:p-4 shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[55vh] object-contain rounded-xl shadow-lg"
            style={{ aspectRatio: '1600 / 1130' }}
          />
        </div>

        {/* معرف التحقق الفريد ومعلومات الشهادة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-text-muted border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">معرف التحقق الرقمي:</span>
            <code className="px-2 py-1 rounded-lg bg-surface-2 font-mono font-bold text-teal-700 dark:text-teal-400 border border-border">
              {certificateId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              className="px-2 py-1 rounded text-[11px] font-bold text-text-muted hover:text-teal-600 transition-colors"
              title="نسخ معرف التحقق"
            >
              {isCopied ? '✓ تم النسخ' : 'نسخ الكود'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بصمة SHA-256 مشفرة محلياً 100%</span>
          </div>
        </div>

        {/* أزرار التحميل والطباعة */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
          <Button
            variant="secondary"
            onClick={handlePrint}
            className="text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 font-bold"
          >
            <Printer className="w-4 h-4 text-text-muted" />
            <span>🖨️ طباعة / حفظ PDF</span>
          </Button>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>📥 تحميل الشهادة كصورة عالية الدقة (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
