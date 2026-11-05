'use client';

import React, { useState } from 'react';
import {
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { CONTACT_STORAGE_KEY } from '../data/legal-pages';
import { getStorageItem, setStorageItem } from '../lib/storage';
import { sendEmailNotification } from '../lib/email-service';
import Card from './Card';
import Button from './Button';

const CATEGORY_OPTIONS = [
  { id: 'general', label: 'استفسار عام حول المسارات الأكاديمية' },
  { id: 'suggestion', label: 'اقتراح تطوير أو إضافة دورة جديدة' },
  { id: 'dmca', label: 'بلاغ عن محتوى أو حقوق ملكية (DMCA)' },
  { id: 'technical', label: 'مشكلة تقنية في الموقع أو مشغل يوتيوب' }
];

const fieldClass =
  'w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text placeholder:text-text-muted focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح للتواصل معك.');
      return;
    }

    setLoading(true);

    const generatedTicket = `APZ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEntry = {
      id: generatedTicket,
      createdAt: new Date().toISOString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      category: formData.category,
      subject: formData.subject.trim() || 'بدون عنوان محدد',
      message: formData.message.trim(),
      status: 'received'
    };

    try {
      const existingList = getStorageItem(CONTACT_STORAGE_KEY, [], Array.isArray);
      const updatedList = [...existingList, newEntry];
      setStorageItem(CONTACT_STORAGE_KEY, updatedList);
    } catch {
      // LocalStorage error handled
    }

    // إرسال الإشعار لبريد مالك الموقع فوراً
    await sendEmailNotification({
      type: 'contact_ticket',
      subject: `📬 تذكرة تواصل جديدة: ${formData.subject.trim() || formData.category}`,
      senderName: formData.name.trim(),
      senderEmail: formData.email.trim(),
      details: {
        'رقم التذكرة': generatedTicket,
        'تصنيف التذكرة': formData.category,
        'الموضوع': formData.subject.trim() || 'بدون عنوان',
        'نص الرسالة': formData.message.trim(),
        'تاريخ الإرسال': new Date().toLocaleString('ar-EG')
      }
    }).catch(() => {});

    setTicketId(generatedTicket);
    setSubmitted(true);
    setLoading(false);
    setFormData({
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    });
  };

  return (
    <Card className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-6 text-right" dir="rtl">
      <div className="space-y-1.5 border-b border-border/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 text-xs font-bold">
          <Mail className="w-3.5 h-3.5" />
          <span>نموذج التذاكر والتواصل المباشر</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-text-heading">
          أرسل تذكرتك أو استفسارك الأكاديمي
        </h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          تصل رسالتك فوراً إلى صندوق البريد الرسمي لإدارة المنصة، ويتم الرد على استفسارك خلال 24 - 48 ساعة كحد أقصى.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-3 animate-smooth">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-text-heading">
            تم استلام تذكرتك بنجاح!
          </h3>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            رقم التذكرة المرجعي الخاص بك: <strong className="font-mono text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded bg-surface border border-teal-500/30">{ticketId}</strong>.
            تم إرسال إشعار فوري لبريد الإدارة وستصلك الإجابة على بريدك الإلكتروني قريباً.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={() => setSubmitted(false)}
              className="text-xs py-2 px-4"
            >
              إرسال رسالة أخرى
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: م. سيف الرحمن"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                البريد الإلكتروني للرد <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                تصنيف التذكرة
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={fieldClass}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-surface text-text">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-text-heading block">
                موضوع الرسالة
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="موضوع موجز يصف الاستفسار..."
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-text-heading block">
              نص الرسالة أو التذكرة بالتفصيل <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="اكتب استفسارك، مقترحك، أو تفاصيل البلاغ هنا بدقة..."
              className={`${fieldClass} p-3 leading-relaxed`}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>خصوصيتك محمية ولن تتم مشاركة بريدك الإلكتروني مع أي طرف ثالث.</span>
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#14B8A6' }}
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'جاري الإرسال...' : 'إرسال التذكرة الآن ✉️'}</span>
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
