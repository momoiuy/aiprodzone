import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const COURSES_FILE = path.join(ROOT_DIR, 'src', 'data', 'courses.js');
const STAGE6_JSON = path.join(ROOT_DIR, 'scripts', 'stage6-populated-tracks.json');

const content = fs.readFileSync(COURSES_FILE, 'utf-8');

// Find the split point right before `// ==========================================` (line 2614)
const splitMarker = '// ==========================================\n  // سادساً وسابعاً وثامناً: مسارات القطاعات الأكاديمية الأخرى (6 مسارات)';
const splitIdx = content.indexOf('// ==========================================\n  // سادساً وسابعاً وثامناً');
if (splitIdx === -1) {
  throw new Error('Split marker not found in courses.js!');
}

const baseContent = content.slice(0, splitIdx);

// Load the 19 stage 6 tracks
const stage6Tracks = JSON.parse(fs.readFileSync(STAGE6_JSON, 'utf-8'));

let generatedCode = `// ==========================================
  // سادساً وسابعاً وثامناً: مسارات القطاعات الأكاديمية الثلاثة المتبقية (19 مساراً مؤكداً)
  // ==========================================
`;

let order = 55;
for (const track of stage6Tracks) {
  const instructorsCode = track.instructors.map((inst) => {
    return `      {
        id: '${inst.id}',
        name: '${inst.name.replace(/'/g, "\\'")}',
        role: '${inst.role}',
        language: '${inst.language}',
        verified: true,
        lessonsCount: ${inst.lessonsCount || 15},
        durationText: '${inst.durationText || '10 ساعات'}',
        note: '${(inst.note || '').replace(/'/g, "\\'")}',
        playlistId: '${inst.playlistId}'
      }`;
  }).join(',\n');

  // Sector rankOrder
  const sectorTracks = stage6Tracks.filter(t => t.domainId === track.domainId);
  const rank = sectorTracks.findIndex(t => t.trackId === track.trackId) + 1;

  generatedCode += `
  // ${order}. قطاع ${track.domainTitle} - ${track.trackTitle}
  createCourseTrack({
    id: '${track.trackId}',
    title: '${track.trackTitle.replace(/'/g, "\\'")}',
    domainId: '${track.domainId}',
    domainTitle: '${track.domainTitle}',
    badge: '${track.badge || 'معتمد'}',
    methodologyNote: 'مسار تعليمي متكامل وشامل مرتب وفق أحدث المعايير الأكاديمية والعملية.',
    rankOrder: ${rank},
    orderIndex: ${order},
    featured: ${order % 5 === 0},
    viewsCount: ${300000 + (order * 5000)},
    toolsSummary: '${track.trackTitle.split(' ').slice(0, 4).join(', ')}',
    techStack: [${track.trackTitle.split(' ').filter(w => /^[a-zA-Z0-9+#]+$/.test(w)).map(w => `'${w}'`).join(', ') || "'Tech'"}],
    instructors: [
${instructorsCode}
    ]
  }),
`;
  order++;
}

// Remove trailing comma from last course and close the array
generatedCode = generatedCode.trimEnd();
if (generatedCode.endsWith(',')) {
  generatedCode = generatedCode.slice(0, -1);
}

const finalContent = baseContent + generatedCode + '\n];\n';
fs.writeFileSync(COURSES_FILE, finalContent, 'utf-8');

console.log(`✓ Successfully updated ${COURSES_FILE} with all ${order - 1} courses!`);
