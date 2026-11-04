/**
 * دالة تطبيع النصوص العربية والإنجليزية للبحث الذكي الفوري (Arabic & English Smart Normalization)
 * منصة AIProdZone - الدليل الأكاديمي الشامل
 * 
 * القواعد المنهجية للتطبيع:
 * 1. إزالة التشكيل وحركات الإعراب والتطويل (Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun, Tatweel)
 * 2. توحيد الهمزات بأنواعها (أ، إ، آ، ٱ) ➔ 'ا'
 * 3. توحيد التاء المربوطة (ة) ➔ 'ه'
 * 4. توحيد الألف المقصورة (ى) ➔ 'ي'
 * 5. توحيد الأحرف الإنجليزية إلى أحرف صغيرة (lowercase) مع إزالة المسافات الزائدة
 * 
 * @param {string | null | undefined} text النص المراد تطبيعه
 * @returns {string} النص المطبع الجاهز للمقارنة والبحث
 */
export function normalizeArabicSearch(text) {
  if (text === null || text === undefined) return '';

  return String(text)
    .toLowerCase()
    .trim()
    // 1. إزالة التشكيل وحركات الإعراب (U+064B إلى U+065F) والألف الخنجرية (U+0670) وعلامة التطويل كشيدة (U+0640)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    // 2. توحيد كافة صور الهمزة والألف (أ، إ، آ، ٱ) إلى ألف مجردة (ا)
    .replace(/[أإآٱ]/g, 'ا')
    // 3. توحيد التاء المربوطة إلى هاء (ة ➔ ه) لتطابق عمليات البحث مثل "برمجة / برمجه"
    .replace(/ة/g, 'ه')
    // 4. توحيد الألف المقصورة إلى ياء (ى ➔ ي) لتطابق "مبتدئ / مبتدى / علي / على"
    .replace(/ى/g, 'ي');
}

/**
 * دالة المطابقة الذكية للبحث السريع (Smart Substring & Token Matcher)
 * تضمن عثور المتعلم على النتيجة سواء بحث بالنص المركب ("ذكاء اصطناعي")،
 * أو بالكلمات المفردة ("إصطناعي" / "اصطناعي")، أو بالأسماء المعرفة بـ "ال"
 * 
 * @param {string | string[] | null | undefined} target النص أو مصفوفة النصوص المستهدفة
 * @param {string | null | undefined} query نص البحث المدخل من المستخدم
 * @returns {boolean} هل تطابق البحث بنجاح
 */
export function matchesSmartSearch(target, query) {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const normQuery = normalizeArabicSearch(query);
  if (!normQuery) return true;

  // دمج إذا كان الهدف مصفوفة من السلاسل النصية
  const haystack = Array.isArray(target)
    ? target.filter(Boolean).join(' ')
    : String(target);

  const normHaystack = normalizeArabicSearch(haystack);
  if (!normHaystack) return false;

  // 1. مطابقة مباشرة سريعة ككتلة نصية واحدة
  if (normHaystack.includes(normQuery)) {
    return true;
  }

  // 2. مطابقة بالكلمات المجزأة (Tokens): يجب أن تتوفر جميع كلمات البحث في الهدف
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length > 1) {
    return queryTokens.every((token) => normHaystack.includes(token));
  }

  return false;
}
