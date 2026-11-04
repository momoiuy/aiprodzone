import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. File Tree
function getFileTree(dir, relativeTo = rootDir, exclude = ['node_modules', '.next', '.git']) {
  const fullPath = path.resolve(rootDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const rel = path.relative(relativeTo, path.join(fullPath, entry.name)).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      results.push(rel + '/');
      results = results.concat(getFileTree(path.join(dir, entry.name), relativeTo, exclude));
    } else {
      results.push(rel);
    }
  }
  return results;
}

const tree = {
  app: getFileTree('app'),
  src: getFileTree('src'),
  tests: getFileTree('tests'),
  scripts: getFileTree('scripts'),
  public: getFileTree('public'),
};

// 2. Data stats from src/data
const { INITIAL_COURSES } = await import('../src/data/courses.js');
const { ACADEMIC_DOMAINS } = await import('../src/data/categories.js');
const { EBOOK_GUIDES, TRACK_GUIDES, BIMO_CATALOG } = await import('../src/data/ebooks.js');
const seedStatus = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/seed-status.json'), 'utf8'));

// Inspect LibraryContext localStorage keys
const libraryContextContent = fs.readFileSync(path.join(rootDir, 'src/context/LibraryContext.jsx'), 'utf8');
const storageKeysFound = [...libraryContextContent.matchAll(/STORAGE_KEYS\s*=\s*{([^}]+)}/g)];

let totalInstructors = 0;
let coursesWithValidPlaylistsAndLessons = 0;
const instructorNames = new Set();
const courseIds = new Set();
const duplicateCourseIds = [];

for (const c of INITIAL_COURSES) {
  if (courseIds.has(c.id)) duplicateCourseIds.push(c.id);
  courseIds.add(c.id);

  let hasValid = true;
  if (!Array.isArray(c.instructors) || c.instructors.length === 0) {
    hasValid = false;
  } else {
    for (const inst of c.instructors) {
      totalInstructors++;
      instructorNames.add(inst.name);
      if (!inst.playlistId || typeof inst.playlistId !== 'string' || inst.playlistId.trim() === '') {
        hasValid = false;
      }
      if (!Array.isArray(inst.lessons) || inst.lessons.length === 0) {
        hasValid = false;
      }
    }
  }
  if (hasValid) coursesWithValidPlaylistsAndLessons++;
}

// Check for old demo courses
const oldDemoIndicators = ['demo-course', 'test-course', 'placeholder', 'dummy'];
const oldDemoCourses = INITIAL_COURSES.filter(c => 
  oldDemoIndicators.some(ind => c.id.toLowerCase().includes(ind) || c.title.toLowerCase().includes(ind))
);

const auditReport = {
  fileTree: tree,
  domainsCount: ACADEMIC_DOMAINS.length,
  domains: ACADEMIC_DOMAINS.map(cat => ({ id: cat.id, name: cat.name })),
  coursesCount: INITIAL_COURSES.length,
  duplicateCourseIds,
  totalInstructorsCount: totalInstructors,
  uniqueInstructorNamesCount: instructorNames.size,
  coursesWithValidPlaylistsAndLessons,
  oldDemoCoursesCount: oldDemoCourses.length,
  ebooks: {
    totalGuides: EBOOK_GUIDES.length,
    trackGuidesCount: (TRACK_GUIDES || []).length,
    bimoCatalogCount: (BIMO_CATALOG || []).length,
  },
  storageKeysFound: storageKeysFound.length > 0 ? storageKeysFound[0][1].trim() : 'Not parsed cleanly',
  seedStatus,
  sampleTracks: [
    INITIAL_COURSES.find(c => c.id === 'python-masterclass'),
    INITIAL_COURSES.find(c => c.id === 'algorithms-masterclass'),
    INITIAL_COURSES.find(c => c.id === 'cisco-ccna-200-301'),
  ]
};

console.log(JSON.stringify({
  domainsCount: auditReport.domainsCount,
  coursesCount: auditReport.coursesCount,
  duplicateCourseIds: auditReport.duplicateCourseIds,
  totalInstructorsCount: auditReport.totalInstructorsCount,
  uniqueInstructorNamesCount: auditReport.uniqueInstructorNamesCount,
  coursesWithValidPlaylistsAndLessons: auditReport.coursesWithValidPlaylistsAndLessons,
  oldDemoCoursesCount: auditReport.oldDemoCoursesCount,
  ebooks: auditReport.ebooks,
  seedStatus: auditReport.seedStatus,
  treeCounts: {
    app: tree.app.length,
    src: tree.src.length,
    tests: tree.tests.length,
    scripts: tree.scripts.length,
    public: tree.public.length,
  }
}, null, 2));

fs.writeFileSync(path.join(rootDir, 'audit-results.json'), JSON.stringify(auditReport, null, 2));
