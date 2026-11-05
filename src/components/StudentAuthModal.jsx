'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Copy,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Button from './Button';
import Chip from './Chip';

const fieldClass =
  'w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text placeholder:text-text-muted focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   initialMode?: 'register' | 'restore'
 * }} props
 */
export default function StudentAuthModal({
  isOpen,
  onClose,
  initialMode = 'register'
}) {
  const {
    studentProfile,
    registerStudent,
    categories = [],
    getPortableSyncCode,
    restoreFromSyncCode
  } = useLibrary() || {};

  const [mode, setMode] = useState(initialMode || 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredSector, setPreferredSector] = useState(
    categories[0]?.name || 'الويب والبرمجة'
  );
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSyncCode, setCopiedSyncCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMsg('يرجى كتابة اسمك الكامل لإصدار الشهادات باسمك.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح لاستلام التحديثات واستعادة الحساب.');
      return;
    }

    const selectedCat = categories.find((c) => c.name === preferredSector);
    const profile = registerStudent({
      name: trimmedName,
      email: trimmedEmail,
      preferredSectorId: selectedCat?.id || 'web-programming',
      preferredSectorTitle: preferredSector
    });

    const code = getPortableSyncCode();
    setGeneratedCode(code);
    setSuccessMsg(`أهلاً بك يا ${profile.name}! تم إنشاء حسابك الأكاديمي بنجاح ✨`);
  };

  const handleRestore = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!syncCodeInput.trim()) {
      setErrorMsg('يرجى لصق كود المزامنة المحمول (Base64) أو كود الاستعادة السريع.');
      return;
    }

    const res = restoreFromSyncCode(syncCodeInput.trim());
    if (res.valid) {
      const restoredName = res.payload?.profile?.name || 'المتعلم';
      setSuccessMsg(`✓ تم استعادة حسابك وتقدمك بنجاح! مرحباً بعودتك يا ${restoredName}.`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.error || 'كود المزامنة غير صالح أو تالف.');
    }
  };

  const handleJsonFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const res = restoreFromSyncCode(text);
        if (res.valid) {
          setSuccessMsg('✓ تم استيراد واستعادة بياناتك الأكاديمية بنجاح!');
          setTimeout(() => onClose(), 1500);
        } else {
          setErrorMsg(res.error || 'الملف لا يحتوي على نسخة احتياطية صالحة.');
        }
      } catch {
        setErrorMsg('تعذر قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyCode = async () => {
    const code = generatedCode || getPortableSyncCode();
    if (!code) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const input = document.createElement('textarea');
        input.value = code;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedSyncCode(true);
      setTimeout(() => setCopiedSyncCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-smooth"
      dir="rtl"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-5 sm:p-7 space-y-5 rounded-3xl border border-border shadow-2xl bg-surface"
      >
        {/* ترويسة النافذة */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>الحساب الأكاديمي للمتعلم</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-text-heading">
              {mode === 'register' ? 'إنشاء حساب أكاديمي مجاني' : 'استعادة حساب سابق وتقدمك'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border text-text-muted hover:text-text-heading hover:bg-surface-2 transition-all"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أزرار التبديل بين التسجيل والاستعادة */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-2 border border-border/80">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-text-muted hover:text-text-heading'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>حساب جديد ✨</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('restore');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'restore'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-text-muted hover:text-text-heading'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>استعادة حساب 🔄</span>
          </button>
        </div>

        {/* تنبيهات النجاح أو الأخطاء */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* عرض كود المزامنة عند اكتمال التسجيل بنجاح */}
        {successMsg && generatedCode && (
          <div className="p-4 rounded-2xl bg-surface-2 border border-teal-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-text-heading">
                كود المزامنة المحمول الخاص بك (احفظه لنقل تقدمك):
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-extrabold text-teal-700 dark:text-teal-400 flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSyncCode ? '✓ تم النسخ بنجاح' : 'نسخ الكود'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={generatedCode}
              className="w-full text-[11px] font-mono p-2.5 rounded-xl bg-surface text-text-muted border border-border select-all"
            />
            <p className="text-[11px] text-text-muted leading-relaxed">
              يمكنك لصق هذا الكود في أي متصفح أو هاتف آخر لفتح حسابك ودروسك المكتملة في ثانية واحدة!
            </p>
            <div className="pt-1">
              <Button
                variant="primary"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white"
              >
                متابعة تصفح المنصة الآن
              </Button>
            </div>
          </div>
        )}

        {/* نموذج إنشاء حساب جديد */}
        {mode === 'register' && !generatedCode && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                الاسم الكامل (لإصدار شهادات الإتمام باسمك) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: م. محمد عبد الله أو سارة أحمد"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                البريد الإلكتروني (للتحديثات الأكاديمية واستعادة الحساب) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                القطاع الأكاديمي المفضل (لتخصيص توصياتك)
              </label>
              <select
                value={preferredSector}
                onChange={(e) => setPreferredSector(e.target.value)}
                className={fieldClass}
              >
                {(categories || []).map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name} className="bg-surface text-text">
                    {cat.shortName || cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-2 border border-border/80 flex items-center gap-2.5 text-xs text-text-muted">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>بياناتك تحفظ محلياً بمتصفحك، بدون أي كوكيز تتبع إعلانية، مع مزامنة فورية بكود Base64.</span>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto text-xs py-2.5">
                إلغاء
              </Button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#14B8A6' }}
              >
                إنشاء حساب أكاديمي مجاني ✨
              </button>
            </div>
          </form>
        )}

        {/* نموذج استعادة حساب سابق */}
        {mode === 'restore' && !successMsg && (
          <div className="space-y-4">
            <form onSubmit={handleRestore} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-text-heading block">
                  كود المزامنة المحمول (Portable Sync Code)
                </label>
                <textarea
                  rows={4}
                  value={syncCodeInput}
                  onChange={(e) => setSyncCodeInput(e.target.value)}
                  placeholder="الصق كود المزامنة المشفر (Base64) هنا..."
                  className={`${fieldClass} font-mono text-xs`}
                />
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-black bg-teal-600 hover:bg-teal-700 text-white"
              >
                استعادة حسابي وتقدمي الآن ⚡
              </Button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-3 text-xs text-text-muted font-bold">أو استعادة عبر ملف JSON</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div>
              <label className="w-full py-3 px-4 rounded-xl border border-dashed border-border hover:border-teal-500 bg-surface-2 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-bold text-text-heading">
                <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>رفع ملف النسخة الاحتياطية (backup.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleJsonFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
