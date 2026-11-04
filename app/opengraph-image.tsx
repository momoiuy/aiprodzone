import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  // جلب خط Cairo المحلي لدعم الحروف العربية في Satori بدقة كاملة
  const fontData = await fetch(
    new URL('../public/fonts/cairo-bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

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
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #042f2e 100%)',
          color: '#ffffff',
          fontFamily: 'Cairo, sans-serif'
        }}
      >
        {/* Header brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: '#042f2e',
                border: '2px solid #14b8a6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                color: '#ffffff'
              }}
            >
              <span>A</span>
              <span style={{ color: '#14b8a6' }}>+</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '30px', fontWeight: 900 }}>
                AIProd<span style={{ color: '#14b8a6' }}>Zone</span>
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
                الدليل الأكاديمي العربي 2026
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 22px',
              borderRadius: '24px',
              background: 'rgba(20, 184, 166, 0.15)',
              border: '1px solid rgba(20, 184, 166, 0.4)',
              color: '#2dd4bf',
              fontSize: '15px',
              fontWeight: 700
            }}
          >
            مجاني 100% • بدون أي إعلانات
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2
            }}
          >
            AIProdZone — الدليل الأكاديمي العربي
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.4
            }}
          >
            المرجع التقني لمسارات علوم الحاسوب، أدوات الذكاء الاصطناعي، وهندسة البرمجيات
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { count: '73', label: 'مساراً أكاديمياً', sub: 'متعدد المحاضرين' },
            { count: '114', label: 'كتاباً ودليلاً', sub: 'سحابي مجاني' },
            { count: '18', label: 'مقالاً مرجعياً', sub: 'هندسي معمق' },
            { count: '0', label: 'إعلانات', sub: 'مفتوح 100%' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 20px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(20, 184, 166, 0.3)'
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#14b8a6', lineHeight: 1 }}>
                {item.count}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', marginTop: '6px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            paddingTop: '16px',
            fontSize: '14px',
            color: '#64748b'
          }}
        >
          <span>منصة تعليمية مفتوحة وغير هادفة للربح</span>
          <span style={{ color: '#14b8a6', fontWeight: 800 }}>
            https://aiprodzone.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cairo',
          data: fontData,
          style: 'normal',
          weight: 700
        }
      ]
    }
  );
}
