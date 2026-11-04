import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'radial-gradient(circle at 85% 15%, #134e4a 0%, #090d16 65%, #050811 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        {/* شريط الهوية العلوي */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #0f172a 0%, #042f2e 100%)',
                border: '2px solid #14b8a6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 900,
                color: '#ffffff'
              }}
            >
              <span>A</span>
              <span style={{ color: '#14b8a6' }}>+</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>
                AIProd<span style={{ color: '#14b8a6' }}>Zone</span>
              </span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                الدليل الأكاديمي العربي 2026
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              borderRadius: 30,
              background: 'rgba(20, 184, 166, 0.12)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              color: '#2dd4bf',
              fontSize: 14,
              fontWeight: 700
            }}
          >
            مجاني 100% • محتوى أكاديمي معتمد
          </div>
        </div>

        {/* العنوان والوصف الرئيسي */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 980 }} dir="rtl">
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.25,
              color: '#f8fafc',
              margin: 0,
              letterSpacing: '-1px'
            }}
          >
            AIProdZone — الدليل الأكاديمي العربي
          </h1>
          <p
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500
            }}
          >
            المرجع التقني الشامل لمسارات علوم الحاسوب، أدوات الذكاء الاصطناعي، وهندسة البرمجيات.
          </p>
        </div>

        {/* بطاقات الإحصائيات الأربعة الفاخرة */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { count: '73', label: 'مساراً أكاديمياً', sub: 'متعدد المحاضرين' },
            { count: '114', label: 'كتاباً ودليلاً', sub: 'سحابي مجاني' },
            { count: '18', label: 'مقالاً مرجعياً', sub: 'هندسي معمق' },
            { count: '0', label: 'إعلانات تجارية', sub: 'مفتوح 100%' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 20px',
                borderRadius: 18,
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 900, color: '#14b8a6', lineHeight: 1 }}>
                {item.count}
              </span>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginTop: 6 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>
                {item.sub}
              </span>
            </div>
          ))}
        </div>

        {/* التذييل والنطاق */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(148, 163, 184, 0.15)',
            paddingTop: 18,
            fontSize: 14,
            color: '#64748b',
            fontWeight: 600
          }}
        >
          <span>منصة تعليمية مفتوحة وغير هادفة للربح</span>
          <span style={{ color: '#14b8a6', fontWeight: 800, letterSpacing: '0.5px' }}>
            https://aiprodzone.com
          </span>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
