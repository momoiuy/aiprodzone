import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      targetEmail,
      web3formsKey,
      type = 'contact_ticket',
      subject = 'إشعار من منصة AIProdZone',
      senderName = 'زائر المنصة',
      senderEmail = 'noreply@aiprodzone.com',
      details = {}
    } = body;

    const destEmail = (
      targetEmail ||
      process.env.OWNER_EMAIL ||
      process.env.NEXT_PUBLIC_OWNER_EMAIL ||
      'contact@aiprodzone.com'
    ).trim();

    let delivered = false;
    let serviceUsed = 'none';

    // 1. خيار Web3Forms في حال توفر المفتاح
    if (web3formsKey && typeof web3formsKey === 'string' && web3formsKey.length > 5) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const formattedDetails = Object.entries(details)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join('\n');

        const web3Res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `[AIProdZone] ${subject}`,
            from_name: `AIProdZone — ${senderName}`,
            name: senderName,
            email: senderEmail,
            replyto: senderEmail,
            message: `نوع الرسالة: ${type}\n\nبيانات الإشعار والتفاصيل:\n${formattedDetails}`
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (web3Res.ok) {
          delivered = true;
          serviceUsed = 'web3forms';
        }
      } catch {
        // Fallback to FormSubmit below
      }
    }

    // 2. خيار FormSubmit.co المجاني الفوري (بدون أي مفتاح API)
    if (!delivered && destEmail.includes('@')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: `[AIProdZone] ${subject}`,
            _replyto: senderEmail,
            _template: 'table',
            _captcha: 'false',
            _autoresponse: 'شكراً لتواصلك مع منصة AIProdZone، استلمنا رسالتك وسنرد عليك قريباً.',
            نوع_الإشعار: type,
            اسم_المرسل: senderName,
            بريد_المرسل: senderEmail,
            ...details
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (formSubmitRes.ok) {
          delivered = true;
          serviceUsed = 'formsubmit';
        }
      } catch {
        // Pass to safe fallback response
      }
    }

    return NextResponse.json({
      ok: true,
      delivered,
      serviceUsed,
      destEmail,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || 'تعذر معالجة الطلب'
      },
      { status: 500 }
    );
  }
}
