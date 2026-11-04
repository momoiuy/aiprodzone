import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://aiprodzone.com';

/**
 * ملف robots.txt القياسي المتوافق مع محركات البحث التقليدية (Google, Bing)
 * ومحركات الإجابة الذكية التوليدية (GPTBot, ClaudeBot, PerplexityBot, وغيرها)
 * مبني للعمل 100% Static في Next.js 14 SSG
 */
export default function robots(): MetadataRoute.Robots {
  const targetUserAgents = [
    '*',
    'Googlebot',
    'Bingbot',
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'Google-Extended',
    'ClaudeBot',
    'PerplexityBot',
    'Applebot'
  ];

  return {
    rules: [
      {
        userAgent: targetUserAgents,
        allow: '/',
        disallow: ['/api/', '/admin', '/admin/']
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
