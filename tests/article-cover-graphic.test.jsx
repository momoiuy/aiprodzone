import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ArticleCoverGraphic from '../src/components/ArticleCoverGraphic';
import { INITIAL_ARTICLES } from '../src/data/articles.js';

describe('ArticleCoverGraphic Component Unit & Architecture Tests (المكون البصري الهندسي)', () => {
  it('renders without throwing errors for all initial articles', () => {
    INITIAL_ARTICLES.forEach((article) => {
      const html = renderToStaticMarkup(
        React.createElement(ArticleCoverGraphic, { article, variant: 'card' })
      );
      expect(html).toBeTruthy();
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox="0 0 600 300"');
    });
  });

  it('guarantees zero network payload (0 external image requests & 0 image tags)', () => {
    INITIAL_ARTICLES.forEach((article) => {
      const html = renderToStaticMarkup(
        React.createElement(ArticleCoverGraphic, { article, variant: 'card' })
      );
      // تأكيد عدم استهلاك أي طلب شبكة أو عناصر صور خارجية
      expect(html).not.toContain('<img');
      expect(html).not.toContain('src=');
      expect(html).not.toContain('https://');
      expect(html).not.toContain('.jpg');
      expect(html).not.toContain('.png');
      expect(html).not.toContain('.webp');
    });
  });

  it('renders correct domain vector geometry and prefixes for AI & Data Science', () => {
    const aiArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-ai-ml-roadmap-hesham-asem');
    expect(aiArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: aiArticle, variant: 'card' })
    );

    expect(html).toContain('AI-ML01');
    expect(html).toContain('AI-DS');
    expect(html).toContain('softmax');
    expect(html).toContain('lucide-brain-circuit');
  });

  it('renders correct domain vector geometry and prefixes for Cybersecurity & Networks', () => {
    const cyberArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cybersecurity-roadmap');
    expect(cyberArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: cyberArticle, variant: 'card' })
    );

    expect(html).toContain('SEC-RD01');
    expect(html).toContain('SEC-NET');
    expect(html).toContain('AES-256');
    expect(html).toContain('lucide-shield-check');
    expect(html).toContain('<polygon');
  });

  it('renders correct domain vector geometry and prefixes for Web & Software Dev', () => {
    const webArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-python-guide');
    expect(webArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: webArticle, variant: 'card' })
    );

    expect(html).toContain('DEV-PY01');
    expect(html).toContain('DEV-WEB');
    expect(html).toContain('app/architecture.tsx');
    expect(html).toContain('{ }');
    expect(html).toContain('lucide-code-xml');
  });

  it('renders correct domain vector geometry and prefixes for DevOps & Cloud', () => {
    const devopsArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-devops-cloud-guide');
    expect(devopsArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: devopsArticle, variant: 'card' })
    );

    expect(html).toContain('OPS-CL01');
    expect(html).toContain('OPS-CLD');
    expect(html).toContain('BUILD');
    expect(html).toContain('DOCKER');
    expect(html).toContain('DEPLOY');
    expect(html).toContain('lucide-cloud-cog');
  });

  it('renders correct domain vector geometry and prefixes for Databases & Backend', () => {
    const dbArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-backend-databases-architecture');
    expect(dbArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: dbArticle, variant: 'card' })
    );

    expect(html).toContain('DAT-BK01');
    expect(html).toContain('DAT-ENG');
    expect(html).toContain('IN-MEMORY CACHE');
    expect(html).toContain('SQL ACID STORE');
    expect(html).toContain('lucide-database');
  });

  it('renders correct domain vector geometry and prefixes for Computer Science', () => {
    const csArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-cs-foundations');
    expect(csArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: csArticle, variant: 'card' })
    );

    expect(html).toContain('CS-FND01');
    expect(html).toContain('CS-ALGO');
    expect(html).toContain('ROOT');
    expect(html).toContain('O(n log n)');
    expect(html).toContain('lucide-binary');
  });

  it('renders correct domain vector geometry and prefixes for Business & Languages', () => {
    const bizArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-powerbi-excel-analytics');
    expect(bizArticle).toBeDefined();

    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: bizArticle, variant: 'card' })
    );

    expect(html).toContain('BIZ-DA01');
    expect(html).toContain('BIZ-LNG');
    expect(html).toContain('+142% KPI');
    expect(html).toContain('lucide-chart-line');
  });

  it('renders tech pills based on article tags', () => {
    const pythonArticle = INITIAL_ARTICLES.find((a) => a.id === 'article-python-guide');
    const html = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: pythonArticle, variant: 'card' })
    );

    expect(html).toContain('#بايثون');
    expect(html).toContain('#Python');
  });

  it('supports hero, card, and banner variants with correct responsive classes', () => {
    const sample = INITIAL_ARTICLES[0];

    const cardHtml = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: sample, variant: 'card' })
    );
    expect(cardHtml).toContain('h-36 sm:h-40');

    const heroHtml = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: sample, variant: 'hero' })
    );
    expect(heroHtml).toContain('h-44 sm:h-48');

    const bannerHtml = renderToStaticMarkup(
      React.createElement(ArticleCoverGraphic, { article: sample, variant: 'banner' })
    );
    expect(bannerHtml).toContain('h-48 sm:h-56 lg:h-64');
  });
});
