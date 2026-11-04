import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_ARTICLES, ARTICLE_CATEGORIES, resolveArticleGeoSeo } from '../src/data/articles.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import {
  buildArticleSchema,
  buildArticlesCollectionSchema,
  ArticleJsonLd,
  ArticleCollectionJsonLd
} from '../src/components/ArticleJsonLd';
import { LibraryProvider } from '../src/context/LibraryContext';
import Articles from '../src/views/Articles';
import seedStatus from '../src/data/seed-status.json';

describe('AIProdZone Comprehensive Technical Articles Platform Tests (المرحلة 8)', () => {
  const allCourseIds = new Set(INITIAL_COURSES.map((c) => c.id));

  describe('أ. التحقق من اكتمال وجودة بيانات المقالات التقنية وعمقها الأكاديمي', () => {
    it('يحتوي على مقالات تقنية تخصصية دقيقة وكاملة دون أي نقص (18 مقالاً مرجعياً)', () => {
      expect(INITIAL_ARTICLES).toBeDefined();
      expect(INITIAL_ARTICLES.length).toBeGreaterThanOrEqual(10);
      expect(INITIAL_ARTICLES.length).toBe(18);
    });

    it('يتحقق من أن جميع المقالات تمتلك معرفات (id) و slugs فريدة وغير مكررة', () => {
      const ids = INITIAL_ARTICLES.map((a) => a.id);
      const slugs = INITIAL_ARTICLES.map((a) => a.slug);
      expect(new Set(ids).size).toBe(INITIAL_ARTICLES.length);
      expect(new Set(slugs).size).toBe(INITIAL_ARTICLES.length);
    });

    it('يتحقق من وجود كافة الحقول الإلزامية في كل مقال وفق المخطط القياسي', () => {
      INITIAL_ARTICLES.forEach((article) => {
        expect(article.id).toBeTruthy();
        expect(article.slug).toBeTruthy();
        expect(article.title).toBeTruthy();
        expect(article.subtitle).toBeTruthy();
        expect(article.category).toBeTruthy();
        expect(article.author).toBeTruthy();
        expect(article.authorRole).toBeTruthy();
        expect(article.publishedAt).toBeTruthy();
        expect(article.readTime).toMatch(/دقائق قراءة/);
        expect(typeof article.featured).toBe('boolean');
        expect(Array.isArray(article.tags)).toBe(true);
        expect(article.tags.length).toBeGreaterThan(0);
        expect(article.summary).toBeTruthy();
        expect(article.summary.length).toBeGreaterThan(50);
        expect(Array.isArray(article.keyTakeaways)).toBe(true);
        expect(article.keyTakeaways.length).toBeGreaterThanOrEqual(4);
        expect(Array.isArray(article.sections)).toBe(true);
        expect(article.sections.length).toBeGreaterThanOrEqual(3);
        expect(Array.isArray(article.relatedCourseIds)).toBe(true);
        expect(article.relatedCourseIds.length).toBeGreaterThan(0);
      });
    });

    it('يتحقق من أن تصنيفات كافة المقالات تنتمي إلى ARTICLE_CATEGORIES المعتمدة', () => {
      const validCategories = new Set(ARTICLE_CATEGORIES);
      INITIAL_ARTICLES.forEach((article) => {
        expect(validCategories.has(article.category)).toBe(true);
      });
    });

    it('يتحقق من أن فصول المقالات عميقة وغنية وليست مجرد نصوص سطحية قصيرة', () => {
      INITIAL_ARTICLES.forEach((article) => {
        article.sections.forEach((sec) => {
          expect(sec.heading).toBeTruthy();
          expect(sec.body).toBeTruthy();
          // التأكد من أن نص الفصل عميق (أكثر من 80 حرفاً لكل فصل)
          expect(sec.body.length).toBeGreaterThan(80);
        });
      });
    });
  });

  describe('ب. التحقق الدقيق من الارتباط بمسارات الدورات الـ 73 (Zero Hallucination)', () => {
    it('يتحقق من أن جميع معرفات الدورات المرتبطة relatedCourseIds موجودة فعلياً في INITIAL_COURSES', () => {
      INITIAL_ARTICLES.forEach((article) => {
        article.relatedCourseIds.forEach((courseId) => {
          const exists = allCourseIds.has(courseId);
          expect(exists, `المسار ${courseId} المرتبط بالمقال "${article.title}" غير موجود في الدورات الـ 73`).toBe(true);
        });
      });
    });

    it('يتحقق من ارتباط مقال بايثون بالمسارات الصحيحة (python, django, flask)', () => {
      const pythonArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-python-guide');
      expect(pythonArticle).toBeDefined();
      expect(pythonArticle.relatedCourseIds).toContain('python-masterclass');
      expect(pythonArticle.relatedCourseIds).toContain('django-masterclass');
      expect(pythonArticle.relatedCourseIds).toContain('flask-masterclass');
    });

    it('يتحقق من ارتباط مقال CCNA 200-301 بمسار سيسكو المعتمد', () => {
      const ccnaArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cisco-ccna-guide');
      expect(ccnaArticle).toBeDefined();
      expect(ccnaArticle.relatedCourseIds).toContain('cisco-ccna-200-301');
    });

    it('يتحقق من ارتباط مقال الأمن السيبراني بمسارات Security+ و اختراق الويب و CEH', () => {
      const cyberArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cybersecurity-roadmap');
      expect(cyberArticle).toBeDefined();
      expect(cyberArticle.relatedCourseIds).toContain('comptia-security-plus');
      expect(cyberArticle.relatedCourseIds).toContain('web-penetration-testing');
      expect(cyberArticle.relatedCourseIds).toContain('certified-ethical-hacker-ceh');
    });

    it('يتحقق من ارتباط مقال تأسيس علوم الحاسوب بـ CS50 والخوارزميات وهياكل البيانات', () => {
      const csArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cs-foundations');
      expect(csArticle).toBeDefined();
      expect(csArticle.relatedCourseIds).toContain('cs50-arabic-masterclass');
      expect(csArticle.relatedCourseIds).toContain('algorithms-masterclass');
      expect(csArticle.relatedCourseIds).toContain('data-structures-masterclass');
    });

    it('يتحقق من ارتباط مقال أطر الواجهات الأمامية بـ React و Vue و Angular و JS/TS', () => {
      const feArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-frontend-frameworks-comparison');
      expect(feArticle).toBeDefined();
      expect(feArticle.relatedCourseIds).toContain('react-masterclass');
      expect(feArticle.relatedCourseIds).toContain('vue-masterclass');
      expect(feArticle.relatedCourseIds).toContain('angular-masterclass');
    });

    it('يتحقق من ارتباط مقال DevOps بمسارات Git و Docker و Kubernetes و Terraform و AWS', () => {
      const devopsArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-devops-cloud-guide');
      expect(devopsArticle).toBeDefined();
      expect(devopsArticle.relatedCourseIds).toContain('git-github-masterclass');
      expect(devopsArticle.relatedCourseIds).toContain('docker-masterclass');
      expect(devopsArticle.relatedCourseIds).toContain('kubernetes-masterclass');
      expect(devopsArticle.relatedCourseIds).toContain('terraform-iac-masterclass');
    });

    it('يتحقق من ارتباط مقال الذكاء الاصطناعي لم. هشام عاصم بمسارات تعلم الآلة والتعلم العميق و NLP', () => {
      const aiArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-ai-ml-roadmap-hesham-asem');
      expect(aiArticle).toBeDefined();
      expect(aiArticle.relatedCourseIds).toContain('machine-learning-data-science');
      expect(aiArticle.relatedCourseIds).toContain('deep-learning-neural-networks');
      expect(aiArticle.relatedCourseIds).toContain('natural-language-processing-nlp');
    });

    it('يتحقق من ارتباط مقال ذكاء الأعمال بـ Power BI و Excel', () => {
      const biArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-powerbi-excel-analytics');
      expect(biArticle).toBeDefined();
      expect(biArticle.relatedCourseIds).toContain('power-bi-data-analysis');
      expect(biArticle.relatedCourseIds).toContain('excel-comprehensive-mastery');
    });

    it('يتحقق من ارتباط مقال هندسة الخلفية بـ SQL و MongoDB و Redis و RabbitMQ', () => {
      const backendArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-backend-databases-architecture');
      expect(backendArticle).toBeDefined();
      expect(backendArticle.relatedCourseIds).toContain('sql-masterclass');
      expect(backendArticle.relatedCourseIds).toContain('mongodb-masterclass');
      expect(backendArticle.relatedCourseIds).toContain('redis-masterclass');
      expect(backendArticle.relatedCourseIds).toContain('rabbitmq-masterclass');
    });

    it('يتحقق من ارتباط مقال خريطة النماذج اللغوية الرائدة 2026 بمسارات تعلم الآلة والتعلم العميق ومعالجة اللغات', () => {
      const llmArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-leading-llms-map-2026');
      expect(llmArticle).toBeDefined();
      expect(llmArticle.category).toBe('الذكاء الاصطناعي وعلم البيانات');
      expect(llmArticle.relatedCourseIds).toContain('machine-learning-data-science');
      expect(llmArticle.relatedCourseIds).toContain('deep-learning-neural-networks');
      expect(llmArticle.relatedCourseIds).toContain('natural-language-processing-nlp');
      expect(llmArticle.definitionLead).toContain('Tiered Model Routing');
    });

    it('يتحقق من ارتباط مقال وكلاء البرمجة و MCP بمسارات أتمتة الأعمال و Git و Node.js', () => {
      const agentArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cli-coding-agents-mcp-revolution');
      expect(agentArticle).toBeDefined();
      expect(agentArticle.category).toBe('الويب والبرمجة');
      expect(agentArticle.relatedCourseIds).toContain('n8n-automation-workflows');
      expect(agentArticle.relatedCourseIds).toContain('git-github-masterclass');
      expect(agentArticle.relatedCourseIds).toContain('nodejs-masterclass');
      expect(agentArticle.definitionLead).toContain('Model Context Protocol');
    });

    it('يتحقق من ارتباط مقال هندسة السياق والـ Hybrid RAG بمسارات معالجة اللغات و SQL ونظرية قواعد البيانات', () => {
      const ragArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-context-engineering-hybrid-rag');
      expect(ragArticle).toBeDefined();
      expect(ragArticle.category).toBe('الذكاء الاصطناعي وعلم البيانات');
      expect(ragArticle.relatedCourseIds).toContain('natural-language-processing-nlp');
      expect(ragArticle.relatedCourseIds).toContain('sql-masterclass');
      expect(ragArticle.relatedCourseIds).toContain('database-theory-masterclass');
      expect(ragArticle.definitionLead).toContain('Context Engineering');
    });

    it('يتحقق من ارتباط مقال أمن وكلاء الذكاء الاصطناعي بمسارات Security+ واختبار الاختراق و CEH وسيسكو', () => {
      const secAgentArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-ai-agents-security-zero-day');
      expect(secAgentArticle).toBeDefined();
      expect(secAgentArticle.category).toBe('الشبكات والأمن السيبراني');
      expect(secAgentArticle.relatedCourseIds).toContain('comptia-security-plus');
      expect(secAgentArticle.relatedCourseIds).toContain('web-penetration-testing');
      expect(secAgentArticle.relatedCourseIds).toContain('certified-ethical-hacker-ceh');
      expect(secAgentArticle.relatedCourseIds).toContain('cisco-ccna-200-301');
      expect(secAgentArticle.definitionLead).toContain('AI Agent Security');
    });

    it('يتحقق من ارتباط مقال صناعة الفيديو بعد إغلاق Sora بمسارات توليد الفيديو وأدوات الذكاء والأخبار والكلمات المفتاحية المطلوبة', () => {
      const videoArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-ai-video-generation-post-sora');
      expect(videoArticle).toBeDefined();
      expect(videoArticle.category).toBe('الذكاء الاصطناعي وعلم البيانات');
      expect(videoArticle.author).toBe('م. سيف الرحمن الهاشمي');
      expect(videoArticle.authorRole).toBe('كبير مهندسي البرمجيات والذكاء الاصطناعي');
      expect(videoArticle.relatedCourseIds).toContain('ai-video-generation');
      expect(videoArticle.relatedCourseIds).toContain('general-ai-tools-mastery');
      expect(videoArticle.relatedCourseIds).toContain('ai-news-weekly-updates');
      expect(videoArticle.definitionLead).toContain('Google Veo 3.1');
      expect(videoArticle.definitionLead).toContain('Kling 4.0');
      expect(videoArticle.comparisonTable.headers).toContain('التسعير والتكلفة المادية');
      expect(videoArticle.seoKeywords).toContain('بدائل Sora 2026');
      expect(videoArticle.seoKeywords).toContain('صناعة الفيديو بالذكاء الاصطناعي');
      expect(videoArticle.seoKeywords).toContain('مقارنة Google Veo 3.1 و Kling 4.0');
      expect(videoArticle.seoKeywords).toContain('شرح Google Flow المجاني');
      expect(videoArticle.seoKeywords).toContain('تشغيل Wan 2.2 على ComfyUI');
      expect(videoArticle.seoKeywords).toContain('HeyGen Avatar V');
    });

    it('يتحقق من ارتباط مقال هندسة السيو الحديث والـ GEO بمسارات السيو و HTML و أدوات الذكاء والكلمات المفتاحية المطلوبة', () => {
      const geoArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-modern-seo-geo-answer-engine-optimization');
      expect(geoArticle).toBeDefined();
      expect(geoArticle.category).toBe('الأعمال واللغات');
      expect(geoArticle.author).toBe('أ. معاذ الميرغني');
      expect(geoArticle.authorRole).toBe('خبير استراتيجيات النمو الرقمي وهندسة المحتوى');
      expect(geoArticle.relatedCourseIds).toContain('seo-search-engine-optimization');
      expect(geoArticle.relatedCourseIds).toContain('html-css-masterclass');
      expect(geoArticle.relatedCourseIds).toContain('general-ai-tools-mastery');
      expect(geoArticle.definitionLead).toContain('Generative Engine Optimization');
      expect(geoArticle.definitionLead).toContain('Stacked JSON-LD');
      expect(geoArticle.comparisonTable.headers).toContain('تحسين محركات الإجابة التوليدية (GEO & AEO)');
      expect(geoArticle.seoKeywords).toContain('تحسين محركات الإجابة GEO');
      expect(geoArticle.seoKeywords).toContain('الفرق بين SEO و AEO و GEO');
      expect(geoArticle.seoKeywords).toContain('كيفية الظهور في إجابات ChatGPT و Gemini');
      expect(geoArticle.seoKeywords).toContain('شرح ملف llms.txt');
      expect(geoArticle.seoKeywords).toContain('Stacked JSON-LD Schema');
    });

    it('يتحقق من ارتباط مقال خارطة الوظائف والمهارات 2026 بمسارات n8n و Kubernetes و Docker و التعلم العميق و AWS والكلمات المفتاحية المطلوبة', () => {
      const rolesArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-tech-job-market-skills-roadmap-2026');
      expect(rolesArticle).toBeDefined();
      expect(rolesArticle.category).toBe('الذكاء الاصطناعي وعلم البيانات');
      expect(rolesArticle.author).toBe('د. كريم عبدالمجيد');
      expect(rolesArticle.authorRole).toBe('أستاذ علوم الحاسوب ومستشار المسارات الأكاديمية');
      expect(rolesArticle.relatedCourseIds).toContain('n8n-automation-workflows');
      expect(rolesArticle.relatedCourseIds).toContain('kubernetes-masterclass');
      expect(rolesArticle.relatedCourseIds).toContain('docker-masterclass');
      expect(rolesArticle.relatedCourseIds).toContain('deep-learning-neural-networks');
      expect(rolesArticle.relatedCourseIds).toContain('aws-cloud-masterclass');
      expect(rolesArticle.definitionLead).toContain('AI Engineering');
      expect(rolesArticle.definitionLead).toContain('ML Engineering');
      expect(rolesArticle.definitionLead).toContain('LLMOps');
      expect(rolesArticle.seoKeywords).toContain('مهارات الذكاء الاصطناعي المطلوبة 2026');
      expect(rolesArticle.seoKeywords).toContain('خارطة طريق مهندس الذكاء الاصطناعي AI Engineer Roadmap');
      expect(rolesArticle.seoKeywords).toContain('الفرق بين AI Engineer و ML Engineer');
      expect(rolesArticle.seoKeywords).toContain('شرح LLMOps و vLLM');
      expect(rolesArticle.seoKeywords).toContain('أتمتة سير العمل n8n');
    });

    it('يتحقق من ارتباط مقال Physical AI و SLMs بمسارات التعلم العميق ومعمارية الحاسوب ولغة التجميع ولينكس و CS50 والكلمات المفتاحية المطلوبة', () => {
      const physicalArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-physical-ai-custom-asics-slms-future');
      expect(physicalArticle).toBeDefined();
      expect(physicalArticle.category).toBe('علوم الحاسوب');
      expect(physicalArticle.author).toBe('م. فراس القحطاني');
      expect(physicalArticle.authorRole).toBe('مهندس نظم سحابية وبنية تحتية');
      expect(physicalArticle.relatedCourseIds).toContain('deep-learning-neural-networks');
      expect(physicalArticle.relatedCourseIds).toContain('computer-architecture-masterclass');
      expect(physicalArticle.relatedCourseIds).toContain('assembly-masterclass');
      expect(physicalArticle.relatedCourseIds).toContain('linux-system-masterclass');
      expect(physicalArticle.relatedCourseIds).toContain('cs50-arabic-masterclass');
      expect(physicalArticle.definitionLead).toContain('Physical AI');
      expect(physicalArticle.definitionLead).toContain('Custom ASICs');
      expect(physicalArticle.definitionLead).toContain('SLMs');
      expect(physicalArticle.seoKeywords).toContain('الذكاء الاصطناعي المادي Physical AI');
      expect(physicalArticle.seoKeywords).toContain('النماذج اللغوية الصغيرة SLM');
      expect(physicalArticle.seoKeywords).toContain('النماذج العودية Recursive Language Models');
      expect(physicalArticle.seoKeywords).toContain('رقائق الذكاء الاصطناعي المخصصة');
      expect(physicalArticle.seoKeywords).toContain('تشغيل الذكاء الاصطناعي محلياً Ollama');
    });
  });

  describe('ج. التحقق من وظائف البحث والفلترة وحالة Seed التخزينية', () => {
    it('يعمل فلتر التصنيف بشكل دقيق ويعيد المقالات المندرجة تحته فقط', () => {
      const webArticles = INITIAL_ARTICLES.filter((a) => a.category === 'الويب والبرمجة');
      expect(webArticles.length).toBeGreaterThanOrEqual(2);
      webArticles.forEach((a) => expect(a.category).toBe('الويب والبرمجة'));
    });

    it('يعمل البحث اللحظي بالكلمات المفتاحية في العناوين والوسوم والفصول', () => {
      const searchByTag = (q) =>
        INITIAL_ARTICLES.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );

      const pythonResults = searchByTag('بايثون');
      expect(pythonResults.length).toBeGreaterThanOrEqual(1);

      const dockerResults = searchByTag('docker');
      expect(dockerResults.length).toBeGreaterThanOrEqual(1);

      const ccnaResults = searchByTag('ccna');
      expect(ccnaResults.length).toBeGreaterThanOrEqual(1);
    });

    it('يتحقق من توثيق المقالات في ملف seed-status.json مع مفتاح التخزين الصحيح', () => {
      expect(seedStatus.articlesStorageKey).toBe('aiprodzone_articles_v1');
      expect(seedStatus.articlesCount).toBeGreaterThanOrEqual(10);
      expect(seedStatus.articlesCount).toBe(18);
    });
  });

  describe('د. اختبارات الترقية المعمارية للسيو (SEO) وتحسين محركات الإجابة التوليدية (GEO 2026)', () => {
    it('يتحقق من احتواء جميع المقالات الـ 10 على الحقول الاختيارية الجديدة الخاصة بـ GEO و SEO دون أي استثناء', () => {
      INITIAL_ARTICLES.forEach((article) => {
        // 1. Definition Lead
        expect(article.definitionLead).toBeTruthy();
        expect(typeof article.definitionLead).toBe('string');
        expect(article.definitionLead.length).toBeGreaterThanOrEqual(40);

        // 2. Quick Takeaways (3-4 points)
        expect(Array.isArray(article.quickTakeaways)).toBe(true);
        expect(article.quickTakeaways.length).toBeGreaterThanOrEqual(3);
        expect(article.quickTakeaways.length).toBeLessThanOrEqual(4);

        // 3. Comparison Table (Structured Table)
        expect(article.comparisonTable).toBeDefined();
        expect(Array.isArray(article.comparisonTable.headers)).toBe(true);
        expect(article.comparisonTable.headers.length).toBeGreaterThanOrEqual(2);
        expect(Array.isArray(article.comparisonTable.rows)).toBe(true);
        expect(article.comparisonTable.rows.length).toBeGreaterThanOrEqual(2);
        article.comparisonTable.rows.forEach((row) => {
          expect(row.length).toBe(article.comparisonTable.headers.length);
        });

        // 4. Conversational FAQs (3-4 questions)
        expect(Array.isArray(article.faqs)).toBe(true);
        expect(article.faqs.length).toBeGreaterThanOrEqual(3);
        expect(article.faqs.length).toBeLessThanOrEqual(4);
        article.faqs.forEach((faq) => {
          expect(faq.question).toBeTruthy();
          expect(faq.question.length).toBeGreaterThan(10);
          expect(faq.answer).toBeTruthy();
          expect(faq.answer.length).toBeGreaterThan(20);
        });

        // 5. SEO & GEO Keywords (Arabic & English)
        expect(Array.isArray(article.seoKeywords)).toBe(true);
        expect(article.seoKeywords.length).toBeGreaterThanOrEqual(4);
        const hasEnglish = article.seoKeywords.some((k) => /[a-zA-Z]/.test(k));
        const hasArabic = article.seoKeywords.some((k) => /[\u0600-\u06FF]/.test(k));
        expect(hasEnglish).toBe(true);
        expect(hasArabic).toBe(true);

        // 6. Last Updated (2026-11)
        expect(article.lastUpdated).toBe('2026-11');
      });
    });

    it('يتحقق من عمل دالة resolveArticleGeoSeo في توفير قيم افتراضية ذكية لمقال قديم يفتقد الحقول الجديدة', () => {
      const bareArticle = {
        id: 'bare-article-test',
        slug: 'bare-article-slug',
        title: 'مقال اختباري تأسيسي',
        category: 'الويب والبرمجة',
        summary: 'هذا ملخص كامل للمقال الاختباري. يوضح كيفية عمل المعالجة.',
        tags: ['تجربة', 'Vitest'],
        publishedAt: '2026-09-01'
      };

      const resolved = resolveArticleGeoSeo(bareArticle);
      expect(resolved).toBeDefined();
      expect(resolved.definitionLead).toBe('هذا ملخص كامل للمقال الاختباري.');
      expect(resolved.quickTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(resolved.faqs.length).toBe(3);
      expect(resolved.seoKeywords).toContain('تجربة');
      expect(resolved.seoKeywords).toContain('الويب والبرمجة');
      expect(resolved.lastUpdated).toBe('2026-09-01');

      // عند تمرير null
      expect(resolveArticleGeoSeo(null)).toBeNull();
    });

    it('يتحقق من صحة بناء مخطط TechArticle المدمج مع FAQPage و BreadcrumbList في مصفوفة graph', () => {
      const sample = INITIAL_ARTICLES[0];
      const schema = buildArticleSchema(sample);

      expect(schema).toBeDefined();
      expect(schema['@context']).toBe('https://schema.org');
      expect(Array.isArray(schema['@graph'])).toBe(true);

      const techArticle = schema['@graph'].find((n) => n['@type'] === 'TechArticle');
      expect(techArticle).toBeDefined();
      expect(techArticle.headline).toBe(sample.title);
      expect(techArticle.description).toBe(sample.summary);
      expect(techArticle.inLanguage).toBe('ar');
      expect(techArticle.datePublished).toBe(sample.publishedAt);
      expect(techArticle.dateModified).toBe('2026-11');
      expect(techArticle.author.name).toBe(sample.author);
      expect(techArticle.publisher.name).toBe('AIProdZone');
      expect(techArticle.about.description).toBe(sample.definitionLead);

      const breadcrumb = schema['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.itemListElement.length).toBe(3);
      expect(breadcrumb.itemListElement[0].name).toBe('الرئيسية');
      expect(breadcrumb.itemListElement[1].name).toBe('المقالات التقنية');
      expect(breadcrumb.itemListElement[2].name).toBe(sample.title);

      const faqPage = schema['@graph'].find((n) => n['@type'] === 'FAQPage');
      expect(faqPage).toBeDefined();
      expect(faqPage.mainEntity.length).toBe(sample.faqs.length);
      expect(faqPage.mainEntity[0]['@type']).toBe('Question');
      expect(faqPage.mainEntity[0].name).toBe(sample.faqs[0].question);
      expect(faqPage.mainEntity[0].acceptedAnswer.text).toBe(sample.faqs[0].answer);
    });

    it('يتحقق من صحة بناء مخطط فهرس المقالات CollectionPage و ItemList لكافة المقالات المرجعية', () => {
      const collectionSchema = buildArticlesCollectionSchema(INITIAL_ARTICLES);

      expect(collectionSchema).toBeDefined();
      expect(collectionSchema['@context']).toBe('https://schema.org');
      expect(Array.isArray(collectionSchema['@graph'])).toBe(true);

      const collectionNode = collectionSchema['@graph'].find((n) => n['@type'] === 'CollectionPage');
      expect(collectionNode).toBeDefined();
      expect(collectionNode.name).toContain('المقالات التقنية');

      const itemListNode = collectionSchema['@graph'].find((n) => n['@type'] === 'ItemList');
      expect(itemListNode).toBeDefined();
      expect(itemListNode.numberOfItems).toBe(INITIAL_ARTICLES.length);
      expect(itemListNode.itemListElement.length).toBe(INITIAL_ARTICLES.length);
      itemListNode.itemListElement.forEach((item, idx) => {
        expect(item['@type']).toBe('ListItem');
        expect(item.position).toBe(idx + 1);
        expect(item.name).toBe(INITIAL_ARTICLES[idx].title);
        expect(item.url).toContain(INITIAL_ARTICLES[idx].slug);
      });
    });

    it('يتحقق من رندر مكونات ArticleJsonLd و ArticleCollectionJsonLd كعناصر script صحيحة', () => {
      const singleHtml = renderToStaticMarkup(
        React.createElement(ArticleJsonLd, { article: INITIAL_ARTICLES[0] })
      );
      expect(singleHtml).toContain('<script type="application/ld+json">');
      expect(singleHtml).toContain('TechArticle');
      expect(singleHtml).toContain('FAQPage');
      expect(singleHtml).toContain('BreadcrumbList');

      const collectionHtml = renderToStaticMarkup(
        React.createElement(ArticleCollectionJsonLd, { articles: INITIAL_ARTICLES })
      );
      expect(collectionHtml).toContain('<script type="application/ld+json">');
      expect(collectionHtml).toContain('CollectionPage');
      expect(collectionHtml).toContain('ItemList');
    });

    it('يتحقق من رندر واجهة قراءة المقال وظهور صندوق الخلاصة الزمردي وجدول المقارنة والأسئلة الشائعة والكلمات المفتاحية', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          null,
          React.createElement(Articles, {
            initialArticleSlug: 'python-learning-guide-zero-codzilla-abdelrahman'
          })
        )
      );

      // تحقق من صندوق الخلاصة التنفيذية بإطار زمردي #14B8A6
      expect(html).toContain('الخلاصة التنفيذية السريعة (Quick Answer &amp; Key Takeaways)');
      expect(html).toContain('#14B8A6');
      expect(html).toContain('الإجابة الحاسمة المباشرة (Direct Answer / Definition):');
      expect(html).toContain(INITIAL_ARTICLES[0].definitionLead);

      // تحقق من تاريخ آخر تحديث
      expect(html).toContain('آخر تحديث:');
      expect(html).toContain('2026-11');

      // تحقق من جدول المقارنة المهيكل المستقل لـ GEO
      expect(html).toContain('جدول المقارنة المنهجي المهيكل (Structured Comparison Matrix)');
      expect(html).toContain('المحاضر');
      expect(html).toContain('أسلوب الشرح');

      // تحقق من قسم الأسئلة الشائعة الحوارية
      expect(html).toContain('الأسئلة الشائعة والأكثر بحثاً (Conversational FAQs)');
      expect(html).toContain(INITIAL_ARTICLES[0].faqs[0].question);

      // تحقق من شارات الكلمات المفتاحية للسيو ومحركات الإجابة
      expect(html).toContain('الكلمات المفتاحية للسيو ومحركات الإجابة (SEO &amp; GEO Keywords):');
      expect(html).toContain('#تعلم بايثون');

      // تحقق من حقن كود JSON-LD داخل الصفحة
      expect(html).toContain('application/ld+json');
    });
  });
});
