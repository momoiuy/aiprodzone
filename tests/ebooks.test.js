import { describe, it, expect } from 'vitest';
import { BIMO_CATEGORIES, BIMO_CATALOG } from '../src/data/bimo-catalog.js';
import { EBOOK_GUIDES, TRACK_GUIDES } from '../src/data/ebooks.js';
import { getSecureCoverUrl } from '../src/views/Ebooks.jsx';

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
      expect(item.itemUrl).toBeTruthy();
      expect(item.itemUrl.startsWith('/books?read=')).toBe(true);
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

  it('strictly guarantees ZERO links to bimocode.com across all 114 books (Zero Bimocode Redirection)', () => {
    EBOOK_GUIDES.forEach((book, index) => {
      if (book.downloadUrl) {
        expect(book.downloadUrl.includes('bimocode.com'), `Book at index ${index} (${book.id}) has downloadUrl pointing to bimocode.com: ${book.downloadUrl}`).toBe(false);
      }
      if (book.itemUrl) {
        expect(book.itemUrl.includes('bimocode.com'), `Book at index ${index} (${book.id}) has itemUrl pointing to bimocode.com: ${book.itemUrl}`).toBe(false);
      }
      if (book.trackUrl) {
        expect(book.trackUrl.includes('bimocode.com')).toBe(false);
      }
    });
  });

  it('verifies cloud items link directly to external cloud storage (MediaFire / Google Drive / Mega)', () => {
    const directItems = BIMO_CATALOG.filter((i) => i.hasDirectDownload);
    expect(directItems.length).toBeGreaterThanOrEqual(44);
    directItems.forEach((item) => {
      expect(item.downloadUrl).toBeTruthy();
      expect(
        item.downloadUrl.includes('mediafire.com') ||
        item.downloadUrl.includes('drive.google.com') ||
        item.downloadUrl.includes('mega.nz') ||
        item.downloadUrl.includes('dropbox.com')
      ).toBe(true);
    });
  });

  it('transforms bimocode image URLs to secure edge CDN proxy (images.weserv.nl)', () => {
    const rawBimoUrl = 'http://bimocode.com/public/storage/product/test-book.jpeg';
    const secureUrl = getSecureCoverUrl(rawBimoUrl);
    expect(secureUrl.startsWith('https://images.weserv.nl/')).toBe(true);
    expect(secureUrl).toContain('bimocode.com');
    expect(secureUrl).toContain('output=webp');

    // Non-bimocode URLs (like YouTube thumbnails) remain unchanged
    const ytUrl = 'https://i.ytimg.com/vi/NtZi_yluSAY/hqdefault.jpg';
    expect(getSecureCoverUrl(ytUrl)).toBe(ytUrl);
    expect(getSecureCoverUrl('')).toBe('');
    expect(getSecureCoverUrl(null)).toBe('');
  });
});
