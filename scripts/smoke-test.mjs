async function smokeTest() {
  const urls = [
    'https://aiprodzone.com',
    'https://aiprodzone.com/articles',
    'https://aiprodzone.com/articles/article-python-guide',
    'https://aiprodzone.com/articles/article-cybersecurity-roadmap',
    'https://aiprodzone.com/books',
    'https://aiprodzone.com/tools'
  ];

  console.log('--- 1. RUNNING LIVE SMOKE TESTS ON AIPRODZONE.COM ---');
  for (const url of urls) {
    const res = await fetch(url, { headers: { 'User-Agent': 'AntigravitySmokeRunner/1.0' } });
    const text = await res.text();
    console.log(`[${res.status} ${res.statusText}] ${url} (${text.length} bytes)`);
    if (res.status !== 200) {
      throw new Error(`Smoke test failed on ${url}: status ${res.status}`);
    }
  }

  const homeRes = await fetch('https://aiprodzone.com', { cache: 'no-store' });
  const homeHtml = await homeRes.text();

  const checks = [
    { name: '✨ شارة مقال مرجعي • تحديث 2026', pass: homeHtml.includes('مقال مرجعي') },
    { name: 'Hero SVG Circuit Grid (0 KB image files)', pass: homeHtml.includes('hero-circuit-grid') },
    { name: 'Zero external image tags in Hero (no hero-bg.webp)', pass: !homeHtml.includes('hero-bg.webp') },
    { name: 'Emerald Progress Bar (#14B8A6)', pass: homeHtml.includes('bg-[#14B8A6]') },
    { name: 'Removal of conflicting old arrows (ابدأ الدرس الآن ◀)', pass: !homeHtml.includes('ابدأ الدرس الآن ◀') },
    { name: 'Academic RTL Layout dir="rtl"', pass: homeHtml.includes('dir="rtl"') }
  ];

  console.log('\n--- 2. VERIFYING HERO ARTICLE CAROUSEL QUALITY CHECKS ---');
  checks.forEach((c) => {
    console.log(`${c.pass ? '✓ PASS' : '✗ FAIL'}: ${c.name}`);
  });

  const allPassed = checks.every((c) => c.pass);
  console.log('\nFINAL SMOKE TEST VERDICT:', allPassed ? '100% ALL CHECKS PASSED SUCCESSFULLY' : 'FAILED');
  if (!allPassed) process.exit(1);
}

smokeTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
