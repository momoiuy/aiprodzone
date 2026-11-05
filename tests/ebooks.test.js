import { describe, it, expect } from 'vitest';
import { BIMO_CATEGORIES, BIMO_CATALOG } from '../src/data/bimo-catalog.js';
import { EBOOK_GUIDES, TRACK_GUIDES } from '../src/data/ebooks.js';

describe('BimoCode Cloud Catalog & Navigation Taxonomy', () => {
  it('includes all 6 exact categories from the requested UI specification', () => {
    const categoryEnNames = BIMO_CATEGORIES.map((c) => c.nameEn);
    expect(categoryEnNames).toContain('Ebook');
    expect(categoryEnNames).toContain('Software');
    expect(categoryEnNames).toContain('Stickers');
    expect(categoryEnNames).toContain('Adobe');
    expect(categoryEnNames).toContain('Theme');
    expect(categoryEnNames).toContain('Plugin');
  });

  it('contains top level All and Track Guides categories', () => {
    const categoryEnNames = BIMO_CATEGORIES.map((c) => c.nameEn);
    expect(categoryEnNames).toContain('All');
    expect(categoryEnNames).toContain('Tracks');
  });

  it('configures Adobe subcategories with Photo Shop and After Effects', () => {
    const adobeCat = BIMO_CATEGORIES.find((c) => c.id === 'adobe');
    expect(adobeCat).toBeDefined();
    expect(adobeCat.hasSub).toBe(true);
    const subIds = adobeCat.subcategories.map((s) => s.id);
    expect(subIds).toContain('photo-shop');
    expect(subIds).toContain('after-effects');
  });

  it('configures Theme and Plugin subcategories', () => {
    const themeCat = BIMO_CATEGORIES.find((c) => c.id === 'theme');
    const pluginCat = BIMO_CATEGORIES.find((c) => c.id === 'plugin');
    expect(themeCat.hasSub).toBe(true);
    expect(pluginCat.hasSub).toBe(true);
    expect(themeCat.subcategories.length).toBeGreaterThan(0);
    expect(pluginCat.subcategories.length).toBeGreaterThan(0);
  });

  it('has 104 unique items in BIMO_CATALOG with valid metadata', () => {
    expect(BIMO_CATALOG.length).toBe(104);
    const ids = new Set(BIMO_CATALOG.map((i) => i.id));
    expect(ids.size).toBe(104);

    BIMO_CATALOG.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.isCloudBook).toBe(true);
      expect(item.remoteCoverUrl).toBeTruthy();
      expect(item.downloadUrl).toBeTruthy();
    });
  });

  it('combines 10 core track guides with 104 cloud items into 114 total ebooks', () => {
    expect(TRACK_GUIDES.length).toBe(10);
    expect(EBOOK_GUIDES.length).toBe(114);
    const ids = new Set(EBOOK_GUIDES.map((i) => i.id));
    expect(ids.size).toBe(114);
  });

  it('guarantees 100% of all 114 books have valid cover URLs and download/read links', () => {
    EBOOK_GUIDES.forEach((book, index) => {
      const coverUrl = book.remoteCoverUrl || book.cover || book.image || book.thumbnail;
      expect(coverUrl, `Book at index ${index} (${book.id}) is missing cover URL`).toBeTruthy();
      expect(coverUrl.startsWith('http'), `Cover URL must start with http/https: ${coverUrl}`).toBe(true);

      const linkUrl = book.downloadUrl || book.itemUrl || book.trackUrl;
      expect(linkUrl, `Book at index ${index} (${book.id}) is missing link URL`).toBeTruthy();

      expect(book.title).toBeTruthy();
      expect(book.category).toBeTruthy();
      expect(book.content).toBeTruthy();
    });
  });

  it('verifies the 10 track guides have direct educational track links and original thumbnails', () => {
    TRACK_GUIDES.forEach((guide) => {
      expect(guide.isCloudBook).toBe(false);
      expect(guide.remoteCoverUrl).toContain('i.ytimg.com');
      expect(guide.downloadUrl.startsWith('/tracks/')).toBe(true);
      expect(guide.itemUrl.startsWith('/books?read=')).toBe(true);
    });
  });

  it('maintains zero local load architecture (all covers and downloads are remote URLs)', () => {
    BIMO_CATALOG.forEach((item) => {
      expect(item.remoteCoverUrl.startsWith('http')).toBe(true);
      expect(item.downloadUrl.startsWith('http')).toBe(true);
    });
  });
});
