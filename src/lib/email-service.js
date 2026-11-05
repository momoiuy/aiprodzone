// @ts-nocheck
// ============================================================================
// AIProdZone Platform — Zero-Cost Email Delivery & Inbox Management Service
// خدمة الإشعارات البريدية المجانية لمالك المنصة وإدارة صندوق الوارد (0 KB Bloat)
// ============================================================================

import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

export const OWNER_EMAIL_STORAGE_KEY = 'aiprodzone_owner_email';
export const WEB3FORMS_KEY_STORAGE_KEY = 'aiprodzone_web3forms_key';
export const INBOX_STORAGE_KEY = 'aiprodzone_inbox_messages';

export const DEFAULT_OWNER_EMAIL = 'contact@aiprodzone.com';

/**
 * أنواع الإشعارات المدعومة في المنصة
 */
export const NOTIFICATION_TYPES = {
  STUDENT_REGISTRATION: 'student_registration',
  CONTACT_TICKET: 'contact_ticket',
  COURSE_SUGGESTION: 'course_suggestion',
  TEST_NOTIFICATION: 'test_notification'
};

export const NOTIFICATION_LABELS = {
  student_registration: 'تسجيل طالب أكاديمي جديد 🎓',
  contact_ticket: 'تذكرة اتصل بنا 📬',
  course_suggestion: 'اقتراح شرح/كورس جديد 💡',
  test_notification: 'إيميل تجريبي للمالك 🧪'
};

/**
 * الحصول على البريد الرسمي المعتمد لمالك الموقع لاستلام الرسائل
 * @returns {string}
 */
export function getOwnerEmail() {
  const envEmail = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_OWNER_EMAIL;
  return getStorageItem(OWNER_EMAIL_STORAGE_KEY, envEmail || DEFAULT_OWNER_EMAIL, (v) => typeof v === 'string' && v.includes('@'));
}

/**
 * تحديث وحفظ بريد المالك الرسمي
 * @param {string} email
 * @returns {boolean}
 */
export function setOwnerEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return false;
  return setStorageItem(OWNER_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
}

/**
 * الحصول على مفتاح Web3Forms الاختياري
 * @returns {string}
 */
export function getWeb3FormsKey() {
  const envKey = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WEB3FORMS_KEY;
  return getStorageItem(WEB3FORMS_KEY_STORAGE_KEY, envKey || '', (v) => typeof v === 'string');
}

/**
 * تحديث وحفظ مفتاح Web3Forms
 * @param {string} key
 * @returns {boolean}
 */
export function setWeb3FormsKey(key) {
  return setStorageItem(WEB3FORMS_KEY_STORAGE_KEY, (key || '').trim());
}

/**
 * قراءة رسائل صندوق الوارد من التخزين المحلي
 * @returns {any[]}
 */
export function getInboxMessages() {
  return getStorageItem(INBOX_STORAGE_KEY, [], Array.isArray);
}

/**
 * حفظ رسالة جديدة في صندوق الوارد
 * @param {any} message
 * @returns {any}
 */
export function saveInboxMessage(message) {
  const messages = getInboxMessages();
  const entry = {
    id: message.id || `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: message.createdAt || new Date().toISOString(),
    type: message.type || NOTIFICATION_TYPES.CONTACT_TICKET,
    typeLabel: NOTIFICATION_LABELS[message.type] || 'إشعار وارد',
    senderName: message.senderName || 'زائر غير مسجل',
    senderEmail: message.senderEmail || '',
    subject: message.subject || 'رسالة جديدة من AIProdZone',
    details: message.details || {},
    status: message.status || 'received'
  };

  const updated = [entry, ...messages];
  setStorageItem(INBOX_STORAGE_KEY, updated);
  return entry;
}

/**
 * حذف رسالة محددة من صندوق الوارد
 * @param {string} id
 * @returns {boolean}
 */
export function deleteInboxMessage(id) {
  const messages = getInboxMessages();
  const filtered = messages.filter((m) => m.id !== id);
  return setStorageItem(INBOX_STORAGE_KEY, filtered);
}

/**
 * إفراغ صندوق الوارد بالكامل
 * @returns {boolean}
 */
export function clearInboxMessages() {
  return setStorageItem(INBOX_STORAGE_KEY, []);
}

/**
 * حساب إحصائيات صندوق الوارد
 * @param {any[]} [messages]
 * @returns {{ total: number, students: number, tickets: number, suggestions: number }}
 */
export function getInboxStats(messages) {
  const list = Array.isArray(messages) ? messages : getInboxMessages();
  let students = 0;
  let tickets = 0;
  let suggestions = 0;

  list.forEach((m) => {
    if (m.type === NOTIFICATION_TYPES.STUDENT_REGISTRATION) students++;
    else if (m.type === NOTIFICATION_TYPES.CONTACT_TICKET) tickets++;
    else if (m.type === NOTIFICATION_TYPES.COURSE_SUGGESTION) suggestions++;
  });

  return {
    total: list.length,
    students,
    tickets,
    suggestions
  };
}

/**
 * تصدير صندوق الوارد والبريد إلى ملف CSV بترميز UTF-8 آمن (مع BOM لمنع تشوه العربية في Excel)
 * @param {any[]} [messages]
 * @returns {string}
 */
export function exportInboxToCsv(messages) {
  const list = Array.isArray(messages) ? messages : getInboxMessages();
  const headers = ['المعرف', 'نوع الإشعار', 'اسم المرسل', 'البريد الإلكتروني', 'الموضوع', 'تاريخ الاستلام', 'التفاصيل'];

  const rows = list.map((m) => {
    const detailsStr = Object.entries(m.details || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ')
      .replace(/"/g, '""');

    return [
      `"${m.id || ''}"`,
      `"${m.typeLabel || m.type || ''}"`,
      `"${(m.senderName || '').replace(/"/g, '""')}"`,
      `"${(m.senderEmail || '').replace(/"/g, '""')}"`,
      `"${(m.subject || '').replace(/"/g, '""')}"`,
      `"${m.createdAt || ''}"`,
      `"${detailsStr}"`
    ].join(',');
  });

  // إضافة BOM لضمان عرض الحروف العربية بشكل مثالي في برامج الجداول كـ Excel
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

/**
 * خدمة إرسال الإشعارات البريدية الهجينة: حفظ محلي فوري + تسليم عبر الـ API / FormSubmit
 * @param {{
 *   type: string,
 *   subject: string,
 *   senderName: string,
 *   senderEmail: string,
 *   details?: Record<string, any>
 * }} payload
 * @returns {Promise<{ success: boolean, messageId: string, remoteDelivered: boolean }>}
 */
export async function sendEmailNotification(payload) {
  const targetEmail = getOwnerEmail();
  const web3formsKey = getWeb3FormsKey();

  // 1. حفظ الرسالة محلياً فوراً لضمان عدم ضياع أي رسالة إطلاقاً
  const savedEntry = saveInboxMessage({
    type: payload.type,
    subject: payload.subject,
    senderName: payload.senderName,
    senderEmail: payload.senderEmail,
    details: payload.details || {}
  });

  let remoteDelivered = false;

  // 2. محاولة التسليم الفوري لبريد المالك عبر مسار الخادم الداخلي أو FormSubmit مباشرة
  try {
    const apiRes = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetEmail,
        web3formsKey,
        type: payload.type,
        subject: payload.subject,
        senderName: payload.senderName,
        senderEmail: payload.senderEmail,
        details: payload.details || {}
      })
    });

    if (apiRes.ok) {
      const resData = await apiRes.json().catch(() => ({}));
      remoteDelivered = Boolean(resData.delivered || resData.ok || resData.success);
    }
  } catch (err) {
    // في حال عدم توفر الاتصال أو أثناء الاختبارات المحلية الصامتة، لا نقذف خطأ لأن الرسالة حُفظت محلياً بنجاح
    // console.warn('[EmailService] Remote send warning:', err);
  }

  return {
    success: true,
    messageId: savedEntry.id,
    remoteDelivered
  };
}

/**
 * إرسال بريد تجريبي للتأكد من وصول الإيميلات لصندوق وارد المالك
 * @param {string} [customEmail]
 * @returns {Promise<{ success: boolean, messageId: string, remoteDelivered: boolean }>}
 */
export async function testEmailNotification(customEmail) {
  const email = customEmail || getOwnerEmail();
  return sendEmailNotification({
    type: NOTIFICATION_TYPES.TEST_NOTIFICATION,
    subject: '🧪 تجربة إرسال إشعار بريدي من منصة AIProdZone',
    senderName: 'فحص النظام الآلي (AIProdZone Diagnostics)',
    senderEmail: email,
    details: {
      'نوع الاختبار': 'فحص تسليم إشعارات الإدارة وصندوق الوارد',
      'حالة الاتصال': 'الخدمة تعمل بنجاح',
      'تاريخ الفحص': new Date().toLocaleString('ar-EG'),
      'ملاحظة': 'إذا وصلت هذه الرسالة إلى بريدك، فإن نظام الإشعارات جاهز تماماً للعمل بدون أي تكلفة إضافية.'
    }
  });
}
