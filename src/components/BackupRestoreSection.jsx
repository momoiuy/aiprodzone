'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Database,
  ShieldCheck,
  FileJson,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import Button from './Button';
import Chip from './Chip';
import Card from './Card';
import {
  createBackupPayload,
  downloadBackupFile,
  restoreBackup,
  validateAndSanitizeBackup
} from '../lib/backup';
import { isStorageAvailable } from '../lib/storage';

/**
 * @param {{ className?: string, onRestoreSuccess?: (result: any) => void }} [props]
 */
export default function BackupRestoreSection({ className = '', onRestoreSuccess = () => {} } = {}) {
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [storageHealthy, setStorageHealthy] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string, details?: any }

  // تحديث إحصائيات البيانات الحالية
  const refreshStats = () => {
    try {
      const payload = createBackupPayload();
      setStats(payload.summary);
      setStorageHealthy(isStorageAvailable());
    } catch {
      setStorageHealthy(false);
    }
  };

  useEffect(() => {
    refreshStats();

    if (typeof window === 'undefined') return;

    const handleSync = () => {
      refreshStats();
    };

    window.addEventListener('aiprodzone_storage_sync', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('aiprodzone_storage_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // معالجة تصدير النسخة الاحتياطية
  const handleExport = () => {
    setExporting(true);
    setStatusMessage(null);

    try {
      const success = downloadBackupFile();
      if (success) {
        setStatusMessage({
          type: 'success',
          text: 'تم تجهيز وتنزيل ملف النسخة الاحتياطية بنجاح على جهازك (JSON Backup).'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'تعذر تنزيل الملف، يرجى التحقق من أذونات المتصفح للتنزيلات.'
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `حدث خطأ غير متوقع أثناء التصدير: ${err?.message || 'خطأ غير معروف'}`
      });
    } finally {
      setExporting(false);
    }
  };

  // فتح نافذة اختيار ملف JSON
  const handleTriggerFileInput = () => {
    setStatusMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // معالجة اختيار الملف واستيراده
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMessage(null);

    try {
      // قراءة محتوى الملف كنص
      let fileContent = '';
      if (typeof file.text === 'function') {
        fileContent = await file.text();
      } else {
        fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file, 'utf-8');
        });
      }

      // فحص أولي قبل الاستعادة
      const validation = validateAndSanitizeBackup(fileContent);
      if (!validation.valid) {
        setStatusMessage({
          type: 'error',
          text: validation.error || 'الملف المختار غير صالح أو تالف.'
        });
        setImporting(false);
        return;
      }

      // استعادة البيانات إلى localStorage وتحديث الواجهة
      const restoreResult = restoreBackup(fileContent);

      if (restoreResult.success) {
        setStatusMessage({
          type: 'success',
          text: 'تم استعادة النسخة الاحتياطية بنجاح وتحديث كافة بيانات التعلم!',
          details: restoreResult.summary
        });
        refreshStats();
        if (typeof onRestoreSuccess === 'function') {
          onRestoreSuccess(restoreResult);
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: restoreResult.error || 'فشلت عملية استعادة البيانات.'
        });
      }
    } catch (err) {
      console.error('[BackupRestoreSection] خطأ أثناء الاستيراد:', err);
      setStatusMessage({
        type: 'error',
        text: `فشل قراءة الملف أو معالجة محتواه: ${err?.message || 'تنسيق غير مدعوم'}`
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className={`p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-sm space-y-5 ${className}`}>
      {/* رأس القسم والعنوان الرئيسي */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-text-heading flex items-center gap-2">
                <span>النسخ الاحتياطي ونقل التقدم (حفظ محلي 100%)</span>
                <Sparkles className="w-4 h-4 text-accent hidden sm:inline" />
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                تصدير محفظة التعلم الكاملة ونقلها إلى أي متصفح أو جهاز آخر دون فقدان أي درس أو تقييم.
              </p>
            </div>
          </div>
        </div>

        {/* شارات الأمان وحالة التخزين */}
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={storageHealthy ? 'accent' : 'warning'} className="text-[11px] font-bold py-1 px-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{storageHealthy ? 'التخزين المحلي محصّن' : 'وضع التخزين المؤقت (Safe Memory)'}</span>
          </Chip>
          <Chip tone="neutral" className="text-[11px] font-bold py-1 px-2.5 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            <span>خصوصية تامة 0% سحابة</span>
          </Chip>
        </div>
      </div>

      {/* ملخص إحصائيات المحفظة الحالية */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 py-1">
          <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
            <span className="text-[11px] text-text-muted font-bold block">الدروس المكتملة</span>
            <span className="text-lg font-black text-text-heading">{stats.completedLessonsCount} درس</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
            <span className="text-[11px] text-text-muted font-bold block">المسارات الكاملة</span>
            <span className="text-lg font-black text-text-heading">{stats.completedCoursesCount} مسار</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
            <span className="text-[11px] text-text-muted font-bold block">قائمة المشاهدة</span>
            <span className="text-lg font-black text-text-heading">{stats.watchlistCount} محفوظ</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
            <span className="text-[11px] text-text-muted font-bold block">تقييماتك للمحتوى</span>
            <span className="text-lg font-black text-text-heading">{stats.userRatingsCount} تقييم</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border/60 col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="text-[11px] text-text-muted font-bold block">ملاحظات وتذاكر</span>
            <span className="text-lg font-black text-text-heading">{stats.customCommentsCount + stats.ticketsCount} عنصر</span>
          </div>
        </div>
      )}

      {/* زرّا الإجراء: التصدير والاستيراد */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        {/* زر تصدير بياناتي */}
        <Button
          variant="primary"
          onClick={handleExport}
          disabled={exporting}
          className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 bg-accent text-accent-ink hover:opacity-90 transition-all shadow-sm active:scale-95"
          title="تصدير نسخة احتياطية من كافة بياناتك كملف JSON"
        >
          {exporting ? (
            <RefreshCw className="w-4 h-4 animate-spin text-accent-ink" />
          ) : (
            <Download className="w-4 h-4 text-accent-ink" />
          )}
          <span>تصدير بياناتي (JSON Backup)</span>
        </Button>

        {/* مدخل ملف مخفي */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="اختيار ملف النسخة الاحتياطية"
        />

        {/* زر استيراد نسخة احتياطية */}
        <Button
          variant="secondary"
          onClick={handleTriggerFileInput}
          disabled={importing}
          className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-surface-2 transition-all active:scale-95 text-text-heading"
          title="استيراد نسخة احتياطية واستعادة كافة التقدم والمحفوظات"
        >
          {importing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
          ) : (
            <Upload className="w-4 h-4 text-accent" />
          )}
          <span>استيراد نسخة احتياطية</span>
        </Button>

        <span className="text-[11px] text-text-muted text-center sm:text-right sm:mr-2">
          الصيغة المدعومة: <code className="text-accent font-mono text-[11px]">.json</code> (إصدار 1.0)
        </span>
      </div>

      {/* رسالة التأكيد الأنيقة باللون الزمردي #14B8A6 أو رسالة الخطأ */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-smooth ${
            statusMessage.type === 'success'
              ? 'bg-teal-500/10 border-teal-500 text-teal-900 dark:text-teal-200'
              : 'bg-red-500/10 border-red-500 text-red-900 dark:text-red-200'
          }`}
          style={
            statusMessage.type === 'success'
              ? {
                  borderColor: '#14B8A6',
                  backgroundColor: 'rgba(20, 184, 166, 0.1)'
                }
              : undefined
          }
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: '#14B8A6' }}
            />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1 text-xs">
            <p className="font-bold leading-relaxed">{statusMessage.text}</p>
            {statusMessage.details && (
              <p className="text-[11px] opacity-90">
                المستعاد: {statusMessage.details.completedLessonsCount} درس مكتمل،{' '}
                {statusMessage.details.completedCoursesCount} مسار كامل،{' '}
                {statusMessage.details.watchlistCount} عناصر مشاهدة،{' '}
                {statusMessage.details.userRatingsCount} تقييم شخصي.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
