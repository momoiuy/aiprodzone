import React from 'react';
import type { Article } from '../types/article';
import { resolveArticleGeoSeo } from '../data/articles';

export interface ArticleJsonLdProps {
  article: Article | Record<string, any>;
}

export interface ArticleCollectionJsonLdProps {
  articles: (Article | Record<string, any>)[];
}

/**
 * بناء مخطط البيانات المهيكلة المزدوجة للمقال التقني
 * يدمج TechArticle مع FAQPage و BreadcrumbList في مصفوفة @graph واحدة
 */
export function buildArticleSchema(rawArticle: Article | Record<string, any>) {
  const article = resolveArticleGeoSeo(rawArticle);
  if (!article) return null;

  const baseUrl = 'https://aiprodzone.com';
  const articleUrl = `${baseUrl}/?view=articles&slug=${article.slug}`;
  const keywords =
    article.seoKeywords && article.seoKeywords.length > 0
      ? article.seoKeywords.join(', ')
      : (article.tags || []).join(', ');

  const techArticleNode: Record<string, any> = {
    '@type': 'TechArticle',
    '@id': `${baseUrl}/articles/${article.slug}#techarticle`,
    url: articleUrl,
    headline: article.title,
    alternativeHeadline: article.subtitle || undefined,
    description: article.summary,
    inLanguage: 'ar',
    datePublished: article.publishedAt,
    dateModified: article.lastUpdated || article.publishedAt || '2026-11-01',
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorRole
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIProdZone',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/brand-banner.png`
      }
    },
    keywords: keywords,
    articleSection: article.category,
    timeRequired: article.readTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };

  if (article.definitionLead) {
    techArticleNode.about = {
      '@type': 'Thing',
      name: article.title,
      description: article.definitionLead
    };
  }

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/articles/${article.slug}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المقالات التقنية',
        item: `${baseUrl}/?view=articles`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl
      }
    ]
  };

  const graph: any[] = [techArticleNode, breadcrumbNode];

  if (article.faqs && Array.isArray(article.faqs) && article.faqs.length > 0) {
    const faqNode = {
      '@type': 'FAQPage',
      '@id': `${baseUrl}/articles/${article.slug}#faq`,
      mainEntity: article.faqs.map((f: { question: string; answer: string }) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    };
    graph.push(faqNode);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

/**
 * بناء مخطط الفهرس العام للمقالات
 * يدمج CollectionPage مع ItemList لجميع مقالات المنصة
 */
export function buildArticlesCollectionSchema(articles: (Article | Record<string, any>)[]) {
  const baseUrl = 'https://aiprodzone.com';
  const collectionUrl = `${baseUrl}/?view=articles`;

  const collectionNode = {
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    url: collectionUrl,
    name: 'المقالات التقنية والأكاديمية — AIProdZone 2026',
    description:
      'دليل المقالات التقنية المتخصصة والمقارنات المعمارية المعتمدة لمسارات البرمجة، الحوسبة السحابية، والذكاء الاصطناعي.',
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: 'AIProdZone',
      url: baseUrl
    }
  };

  const itemListNode = {
    '@type': 'ItemList',
    '@id': `${collectionUrl}#itemlist`,
    numberOfItems: articles.length,
    itemListElement: articles.map((rawArticle, idx) => {
      const article = resolveArticleGeoSeo(rawArticle);
      return {
        '@type': 'ListItem',
        position: idx + 1,
        name: article.title,
        description: article.summary,
        url: `${baseUrl}/?view=articles&slug=${article.slug}`
      };
    })
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [collectionNode, itemListNode]
  };
}

/**
 * مكون خفيف لحقن JSON-LD الخاص بالمقال في الصفحة
 * يدعم كلاً من Server Components و Client Components
 */
export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const schema = buildArticleSchema(article);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * مكون خفيف لحقن JSON-LD الخاص بفهرس المقالات في الصفحة
 * يدعم كلاً من Server Components و Client Components
 */
export function ArticleCollectionJsonLd({ articles }: ArticleCollectionJsonLdProps) {
  const schema = buildArticlesCollectionSchema(articles);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ArticleJsonLd;
