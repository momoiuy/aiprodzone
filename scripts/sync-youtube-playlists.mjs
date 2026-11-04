#!/usr/bin/env node
/**
 * سكريبت مزامنة وجلب قوائم التشغيل والدروس الحقيقية من يوتيوب (Zero-Hallucination Engine)
 * الاستخدام:
 *   node scripts/sync-youtube-playlists.mjs --stage5
 *   node scripts/sync-youtube-playlists.mjs --all
 *   node scripts/sync-youtube-playlists.mjs --playlist "PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"
 *   node scripts/sync-youtube-playlists.mjs --query "Elzero Web School بايثون"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parsePlaylistId,
  searchYouTubePlaylists,
  fetchPlaylistDetails
} from '../src/lib/youtube-scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_FILE = path.join(ROOT_DIR, 'src', 'data', 'youtube-cache.json');

// قوائم يوتيوب الرسمية المؤكدة لمسارات المرحلة 4 (الدفعة الأولى - 29 مساراً)
export const STAGE4_PLAYLISTS = [
  // أولاً: قطاع الويب والبرمجة (21 مساراً)
  // 1. بايثون (Python)
  { id: 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs', track: 'Python', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ', track: 'Python', inst: 'Codezilla', role: 'بديل معتمد' },
  { id: 'PLknwEmKsW8OsG8dnisr_-2WGyx7lpgGEE', track: 'Python', inst: 'Abdelrahman Gamal', role: 'بديل معتمد' },

  // 2. جافاسكربت (JavaScript)
  { id: 'PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv', track: 'JavaScript', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLknwEmKsW8OuTqUDaFRBiAViDZ5uI3VcE', track: 'JavaScript', inst: 'Abdelrahman Gamal', role: 'بديل معتمد' },
  { id: 'PLLWuK602vNiVnYxkrT7qbFSictc9nJeiX', track: 'JavaScript', inst: 'Mohammed Elzanaty', role: 'بديل معتمد' },

  // 3. HTML وCSS
  { id: 'PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji', track: 'HTML & CSS', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLYyqC4bNbCIdES52srHE6xTiIgvgMkBWu', track: 'HTML & CSS', inst: 'أكاديمية ترميز', role: 'بديل معتمد' },
  { id: 'PLoP3S2S1qTfCVIETOGwaK3lyaL3UKu403', track: 'HTML & CSS', inst: 'OctuCode', role: 'بديل معتمد' },

  // 4. Bootstrap
  { id: 'PLDoPjvoNmBAyvm7f--dc6XqkpfDcen_vQ', track: 'Bootstrap', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLknwEmKsW8OscL9GvjxwL7RYbcwwdIitk', track: 'Bootstrap', inst: 'Abdelrahman Gamal', role: 'بديل معتمد' },
  { id: 'PLnD96kXp-_pMJp3stPetkN76AJ2mmeah7', track: 'Bootstrap', inst: 'Ag Coding', role: 'بديل معتمد' },

  // 5. Tailwind CSS
  { id: 'PLnD96kXp-_pMR9cBUmvsz_kIIt9bv2UIP', track: 'Tailwind CSS', inst: 'Ag Coding', role: 'أساسي' },

  // 6. Sass
  { id: 'PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2', track: 'Sass', inst: 'Elzero', role: 'أساسي' },

  // 7. jQuery
  { id: 'PLDoPjvoNmBAwXDFEEpc8TT6MFbDAC5XNB', track: 'jQuery', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLzCpl3aBwaY5CmY-9Td8GhlLnq9GuJmpB', track: 'jQuery', inst: 'Mobarmg (ITI)', role: 'بديل معتمد' },
  { id: 'PLHIfW1KZRIfll3ObMFi02Ry7oRU3MJVRG', track: 'jQuery', inst: 'Hassouna Academy', role: 'بديل معتمد' },

  // 8. TypeScript
  { id: 'PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ', track: 'TypeScript', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLFRm7nYIypQF618y6D_JO4d8vrj988wJf', track: 'TypeScript', inst: 'Programming Solutions', role: 'بديل معتمد' },
  { id: 'PLF8OvnCBlEY27rEmxg4F86iFljMXyCmk1', track: 'TypeScript', inst: 'Hussein Al Rubaye', role: 'بديل معتمد' },

  // 9. React
  { id: 'PLfDx4cQoUNObRCqeYOws_JK_CCGCmQv_l', track: 'React', inst: 'Algorithm Academy', role: 'أساسي' },
  { id: 'PLtFbQRDJ11kEjXWZmwkOV-vfXmrEEsuEW', track: 'React', inst: 'Unique Coderz', role: 'بديل معتمد' },
  { id: 'PLejc1JbD4ZFSaQIFNstRIrbm_fqb12Q59', track: 'React', inst: 'kimz codes', role: 'بديل معتمد' },

  // 10. Vue
  { id: 'PLDoPjvoNmBAxr5AqK3Yz4DWYKVSmIFziw', track: 'Vue', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLfDx4cQoUNObtw2FtE4_eX_k9yCf-Fcd3', track: 'Vue', inst: 'Algorithm Academy', role: 'بديل معتمد' },

  // 11. Angular
  { id: 'PLL2zWZTDFZzh2WEmc3fH_O4y4N05ZCqB2', track: 'Angular', inst: 'KMR Script', role: 'أساسي' },
  { id: 'PLQtNtS-WfRa8piCgv_buHpthEBXHaw0ss', track: 'Angular', inst: 'codeZone', role: 'بديل معتمد' },
  { id: 'PLzCpl3aBwaY7eOwGMlps70dTYs2TSsgj1', track: 'Angular', inst: 'Mobarmg (ITI)', role: 'بديل معتمد' },

  // 12. Node.js
  { id: 'PLGhZWewM_75LQf3KvHo6HHSclmDyDazl7', track: 'Node.js', inst: 'Emam Academy', role: 'أساسي' },
  { id: 'PLfDx4cQoUNOa3EiUpjO04DVxEE9Ox12ta', track: 'Node.js', inst: 'Algorithm Academy', role: 'بديل معتمد' },
  { id: 'PLkzDzmo9y3VG_pByjuxE7uuLYvmWgfBub', track: 'Node.js', inst: 'تخاريف مبرمج', role: 'بديل معتمد' },

  // 13. Nest.js
  { id: 'PLYyqC4bNbCIdlMvge1ZG-jJlQtjHHZQWl', track: 'Nest.js', inst: 'أكاديمية ترميز', role: 'أساسي' },
  { id: 'PLDQ11FgmbqQP1aaCCiU74LzebvZjY_S4G', track: 'Nest.js', inst: 'Index Academy', role: 'بديل معتمد' },
  { id: 'PLOldSEMXUdZsFAEJwxYkE83dhm1ZkWEOL', track: 'Nest.js', inst: 'Mahmoud Abdullah', role: 'بديل معتمد' },

  // 14. Nuxt.js
  { id: 'PLLXntwspGdhCBdax1ZJTEX6Gg5vCwOSUL', track: 'Nuxt.js', inst: 'Mahmoud Zohdi', role: 'أساسي' },

  // 15. PHP
  { id: 'PLDoPjvoNmBAy41u35AqJUrI-H83DObUDq', track: 'PHP', inst: 'Elzero', role: 'أساسي' },
  { id: 'PLftLUHfDSiZ7pKXkpGCoZATm5rF6msj5A', track: 'PHP', inst: 'Mora Soft', role: 'بديل معتمد' },

  // 16. Laravel
  { id: 'PL6XRLlEsQ_7Xy0fwWHhmo5H_RCI1RbtqG', track: 'Laravel', inst: 'Professional Code', role: 'أساسي' },
  { id: 'PLftLUHfDSiZ4GfPZxaFDsA7ejUzD7SpWa', track: 'Laravel', inst: 'Mora Soft', role: 'بديل معتمد' },
  { id: 'PLd4ZH7drWj7DAt5osYlsya3sscPoERtGC', track: 'Laravel', inst: 'Mohammed Mustafa', role: 'بديل معتمد' },

  // 17. Django
  { id: 'PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm', track: 'Django', inst: 'Abdelrahman Gamal', role: 'أساسي' },
  { id: 'PLTcPeoMjkuCxoyflbe4AuNWMZWulKVbr4', track: 'Django', inst: 'شبكة علوم', role: 'بديل معتمد' },
  { id: 'PLdZYzC8fohEKjuYyvITqYc2vL0lAWRvhs', track: 'Django', inst: 'Elsafy Hegazy', role: 'بديل معتمد' },

  // 18. Flask
  { id: 'PLfDx4cQoUNObFOYvkcNQG8arJX95TRE47', track: 'Flask', inst: 'Algorithm Academy', role: 'أساسي' },

  // 19. Java
  { id: 'PLnzqK5HvcpwTgEDztQ8y4K4-VoeoK1QCG', track: 'Java', inst: 'محمد شوشان', role: 'أساسي' },
  { id: 'PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN', track: 'Java', inst: 'Adel Nasim', role: 'بديل معتمد' },
  { id: 'PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f', track: 'Java', inst: 'محمد الدسوقي', role: 'بديل معتمد' },

  // 20. C#
  { id: 'PLX1bW_GeBRhCU9l7examhVrARmXHHRrLR', track: 'C#', inst: 'Codographia', role: 'أساسي' },
  { id: 'PLsV97AQt78NT0H8J71qe7edwRpAirfqOI', track: 'C#', inst: 'Passionate Coders', role: 'بديل معتمد' },
  { id: 'PLnzqK5HvcpwQLsXXXxx_mX3WvUEgGM0iA', track: 'C#', inst: 'محمد شوشان', role: 'بديل معتمد' },

  // 21. ASP.NET
  { id: 'PLwj1YcMhLRN1zbN2olMzvIBXP06FIwoes', track: 'ASP.NET', inst: 'Khalid Essaadani', role: 'أساسي' },
  { id: 'PLX1bW_GeBRhAjpkPCTpKXJoFGe2ZpYGUC', track: 'ASP.NET', inst: 'Codographia', role: 'بديل معتمد' },
  { id: 'PLsV97AQt78NQ8E7cEqovH0zLYRJgJahGh', track: 'ASP.NET', inst: 'Passionate Coders', role: 'بديل معتمد' },

  // ثانياً: قطاع لغات وتطبيقات وألعاب (8 مسارات)
  // 22. C++
  { id: 'PLCInYL3l2AajFAiw4s1U4QbGszcQ-rAb3', track: 'C++', inst: 'Adel Nasim', role: 'أساسي' },
  { id: 'PL1DUmTEdeA6IUD9Gt5rZlQfbZyAWXd-oD', track: 'C++', inst: 'محمد الدسوقي', role: 'بديل معتمد' },
  { id: 'PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS', track: 'C++', inst: 'Elzero', role: 'بديل معتمد' },

  // 23. C
  { id: 'PLMm8EjqH1EFXI8wByY0umF_DQON2S9uws', track: 'C', inst: 'Ahmed Sallam', role: 'أساسي' },
  { id: 'PLEBRPBUkZ4mb6lVqSLRQ7mvSFRcoR7-XV', track: 'C', inst: 'FCI-Career-Build', role: 'بديل معتمد' },

  // 24. Rust
  { id: 'PLald6EODoOJU0GMuYHlkS9MLhTPE7HiaT', track: 'Rust', inst: 'Ahmed Farghal (Rust للغلابة)', role: 'أساسي' },
  { id: 'PLald6EODoOJWcSXfix8tgr5aVS76IU11M', track: 'Rust', inst: 'Ahmed Farghal (Rust and chill)', role: 'مكمل' },

  // 25. Dart
  { id: 'PLMDrOnfT8EAj6Yjdki9OCLSwqdBs4xhQz', track: 'Dart', inst: 'Asem Saafan', role: 'أساسي' },

  // 26. Flutter
  { id: 'PL0vtyWBHY2NXQ9PxbZV8ixhIRirs8WCt_', track: 'Flutter', inst: 'Tarek Alabd', role: 'أساسي' },
  { id: 'PLwWuxCLlF_ucnfkI-_yNRCOTI-yJa5N-a', track: 'Flutter', inst: 'Omar Ahmed', role: 'بديل معتمد' },
  { id: 'PLGVaNq6mHinjCPki-3xraQdGWKVz7PhgI', track: 'Flutter', inst: 'Scholar Tech', role: 'بديل معتمد' },

  // 27. iOS
  { id: 'PLQaOY10EEc8bNbEBMyiJU1I-GIgs1LQfj', track: 'iOS', inst: 'بامبرمج', role: 'أساسي' },

  // 28. Godot
  { id: 'PLqBd9au_wtU3eX7mLVuLLOt9sfbDWlJsq', track: 'Godot', inst: 'Ahmed Mo’nis', role: 'أساسي' },
  { id: 'PLXUEZFpQn01Hp06m0MxlMzj8x5Y2n9Dek', track: 'Godot', inst: 'SpriteSheet', role: 'بديل معتمد' },
  { id: 'PLU8IixMdsBbmpMmYpgSCkemhqlLpTJAnJ', track: 'Godot', inst: 'Whales State', role: 'بديل معتمد' },

  // 29. Unity
  { id: 'PLltZRmsFXWnLp98IIM1CISQYWowq87YSp', track: 'Unity', inst: '6wrni (2D Game)', role: 'أساسي' },
  { id: 'PLltZRmsFXWnKk5F3_ltKWKq6lZLveotIF', track: 'Unity', inst: '6wrni (3D Game)', role: 'مكمل' }
];

// قوائم يوتيوب الرسمية المؤكدة لمسارات المرحلة 5 (الدفعة الثانية - 25 مساراً)
export const STAGE5_PLAYLISTS = [
  // ==========================================
  // ثالثاً: قطاع علوم الحاسوب (8 مسارات)
  // ==========================================
  // 1. الخوارزميات
  { id: 'PLwCMLs3sjOY6KH-8c9F-lMWn-r02hyoV_', track: 'الخوارزميات', inst: 'Hard-Code', role: 'أساسي' },
  { id: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp', track: 'الخوارزميات', inst: 'Adel Nasim', role: 'بديل معتمد' },
  { id: 'PL1DUmTEdeA6JlommmGP5wicYLxX5PVCQt', track: 'الخوارزميات', inst: 'محمد الدسوقي', role: 'بديل معتمد' },

  // 2. هياكل البيانات
  { id: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp', track: 'هياكل البيانات', inst: 'Adel Nasim', role: 'أساسي' },
  { id: 'PLwCMLs3sjOY4UQq4vXgGPwGLVX1Y5faaS', track: 'هياكل البيانات', inst: 'Hard-Code', role: 'بديل معتمد' },
  { id: 'PLIxq078xdGdZWUXwumK9lbEn3kKwKLTwx', track: 'هياكل البيانات', inst: 'Nehal Elsamoly', role: 'بديل معتمد' },

  // 3. Assembly
  { id: 'PLMm8EjqH1EFVodghdDWaAuHkHqj-nJ0bN', track: 'Assembly', inst: 'Ahmed Sallam', role: 'أساسي' },
  { id: 'PLi0-RQZxQ8Fmwopq43StX61igOvXbFMQv', track: 'Assembly', inst: 'Sherif Ezzat', role: 'بديل معتمد' },

  // 4. معمارية الحاسوب
  { id: 'PLMm8EjqH1EFVEVWSiBdCoBEJHffjHUScZ', track: 'معمارية الحاسوب', inst: 'Ahmed Sallam', role: 'أساسي' },

  // 5. أنظمة التشغيل
  { id: 'PLMm8EjqH1EFV-jECqtMxeVMDoVkV_kJDY', track: 'أنظمة التشغيل', inst: 'Ahmed Sallam', role: 'أساسي' },
  { id: 'PLxIvc-MGOs6ib0oK1z9C46DeKd9rRcSMY', track: 'أنظمة التشغيل', inst: 'Ahmed Hagag', role: 'بديل معتمد' },
  { id: 'PLTr1xN4uMK5seRz6IO7Am9Zp2UKdnzO_n', track: 'أنظمة التشغيل', inst: 'Mohamed Alsayed', role: 'بديل معتمد' },

  // 6. Linux
  { id: 'PL8pYI62gCNsWTppELEUCpforC4avEiLox', track: 'Linux', inst: 'anahr', role: 'أساسي' },

  // 7. Prolog
  { id: 'PLMm8EjqH1EFW9Faldu6D6Uh2j1EWWaTYe', track: 'Prolog', inst: 'Ahmed Sallam', role: 'أساسي' },

  // 8. CS50 بالعربي
  { id: 'PLL2zWZTDFZzibJ49gBM2owqCzda8meSNj', track: 'CS50 بالعربي', inst: 'KMR Script', role: 'أساسي' },
  { id: 'PLnrlZUDQofUv7JE4QIahAyztrQU9bnJmd', track: 'CS50 بالعربي', inst: 'Coders Camp (رشا عابدين)', role: 'بديل معتمد' },
  { id: 'PLknwEmKsW8OvMsFbU9zo8oJCprAsgc4LO', track: 'CS50 بالعربي', inst: 'Abdelrahman Gamal', role: 'بديل معتمد' },

  // ==========================================
  // رابعاً: قطاع قواعد البيانات والخلفية (6 مسارات)
  // ==========================================
  // 1. قواعد البيانات (نظري)
  { id: 'PL37D52B7714788190', track: 'قواعد البيانات (نظري)', inst: 'محمد الدسوقي', role: 'أساسي' },
  { id: 'PLL2zWZTDFZzhXQ1bcYlO3PtN4MsLiG-gy', track: 'قواعد البيانات (نظري)', inst: 'KMR Script', role: 'بديل معتمد' },

  // 2. SQL
  { id: 'PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9', track: 'SQL', inst: 'Elzero (MySQL)', role: 'أساسي' },
  { id: 'PL85D9FC9DFD6B9484', track: 'SQL', inst: 'محمد الدسوقي', role: 'بديل معتمد' },
  { id: 'PLF8OvnCBlEY25O_Ql0CrgQUAc5NVYkWF2', track: 'SQL', inst: 'TheNewBaghdad', role: 'بديل معتمد' },

  // 3. MongoDB
  { id: 'PLfDx4cQoUNObp1ujQRNooNiadKdlflevM', track: 'MongoDB', inst: 'Algorithm Academy', role: 'أساسي' },
  { id: 'PLGhZWewM_75IILJm_1QDq0yPLbLQz_TCb', track: 'MongoDB', inst: 'Emam Academy', role: 'بديل معتمد' },
  { id: 'PLF8OvnCBlEY1sdUym7Cnb5Xc3d7HXLjqf', track: 'MongoDB', inst: 'TheNewBaghdad', role: 'بديل معتمد' },

  // 4. Redis
  { id: 'PLZd2bo_SbAm_ijqLfnx94qkmytbWjUQ-h', track: 'Redis', inst: 'Ismail Anjrini', role: 'أساسي' },

  // 5. Elastic
  { id: 'PLahnTWf-ROoXRZQp4iWrzkRfTjrPjSw3W', track: 'Elastic', inst: 'Ismail Anjrini', role: 'أساسي' },

  // 6. RabbitMQ
  { id: 'PLZd2bo_SbAm9uJ2J5ryEOZV7ojLwGkATc', track: 'RabbitMQ', inst: 'Ismail Anjrini', role: 'أساسي' },

  // ==========================================
  // خامساً: قطاع DevOps والسحابة والهندسة (11 مساراً)
  // ==========================================
  // 1. Git
  { id: 'PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF', track: 'Git', inst: 'Elzero', role: 'أساسي' },
  { id: 'PL_aOZuct6oAogr4UMkWddU7leOXw0QKJS', track: 'Git', inst: 'Khalid Elshafie', role: 'بديل معتمد' },
  { id: 'PLYyqC4bNbCIeCHLTRtwdLpQvle_zIavZ-', track: 'Git', inst: 'أكاديمية ترميز', role: 'بديل معتمد' },

  // 2. Docker
  { id: 'PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ', track: 'Docker', inst: 'Codographia', role: 'أساسي' },
  { id: 'PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR', track: 'Docker', inst: 'Tresmerge', role: 'بديل معتمد' },
  { id: 'PLJK0gWS0uZDYdUuQBJLhUakQ_09qWMSb_', track: 'Docker', inst: 'Ahmed Sami', role: 'بديل معتمد' },

  // 3. Kubernetes
  { id: 'PLX1bW_GeBRhDCHijCrMO5F-oHg52rRBpl', track: 'Kubernetes', inst: 'Codographia', role: 'أساسي' },
  { id: 'PLTRDUPO2OmInz2Fo41zwnoR1IArx70Hig', track: 'Kubernetes', inst: 'Ahmed Elemam', role: 'بديل معتمد' },

  // 4. Terraform
  { id: 'PLX1bW_GeBRhBIT9-Nyt4_osatqokaN8ae', track: 'Terraform', inst: 'Codographia', role: 'أساسي' },

  // 5. Google Cloud
  { id: 'PLZd2bo_SbAm-JJyJ5kJA02rcOXnyfqIWO', track: 'Google Cloud', inst: 'Ismail Anjrini', role: 'أساسي' },

  // 6. AWS
  { id: 'PLLlr6jKKdyK0ZbS1lSWOLipuiXWJZhEHG', track: 'AWS', inst: 'Free4arab (محمد عدي)', role: 'أساسي' },
  { id: 'PLOoZRfEtk6kWSM_l9xMjDh-_MJXl03-pf', track: 'AWS', inst: 'AWS Riyadh User Group', role: 'بديل معتمد' },

  // 7. Microservices
  { id: 'PLZd2bo_SbAm-LKJ_x_OuOZtuwEFqbJ5B7', track: 'Microservices', inst: 'Ismail Anjrini', role: 'أساسي' },
  { id: 'PLZafHDYyxnk6S9bweaJ_KYuYqituwyXjl', track: 'Microservices', inst: 'Mahmoud Youssef', role: 'بديل معتمد' },
  { id: 'PLgAqrVq84PDdfiDow3YVsgc1q34JD415Z', track: 'Microservices', inst: 'Software Architecture Talks', role: 'بديل معتمد' },

  // 8. أنماط التصميم وSOLID
  { id: 'PLnqAlQ9hFYdflFSS4NigVB7aSoYPNwHTL', track: 'أنماط التصميم وSOLID', inst: 'Mohammed Reda', role: 'أساسي' },
  { id: 'PLwWuxCLlF_uevri_OpofVLXkRRFnZ7TSV', track: 'أنماط التصميم وSOLID', inst: 'Omar Ahmed', role: 'بديل معتمد' },
  { id: 'PLsV97AQt78NTrqUAZM562JbR3ljX19JFR', track: 'أنماط التصميم وSOLID', inst: 'Passionate Coders', role: 'بديل معتمد' },

  // 9. اختبار البرمجيات
  { id: 'PLzNfs-3kBUJllCa8_6pLYDMnIlg6Lfvu4', track: 'اختبار البرمجيات', inst: 'Tresmerge', role: 'أساسي' },

  // 10. RegEx
  { id: 'PLBPdtL8DZBZISjop48YSJ82FF-2uIhe-f', track: 'RegEx', inst: 'Abdallah Alfaham', role: 'أساسي' },
  { id: 'PLwCMLs3sjOY4aVMg7hgQGHyQBZnHgFjJk', track: 'RegEx', inst: 'Hard-Code', role: 'بديل معتمد' },
  { id: 'PLt0HRIA9i35v2W3JFiCIeUMC4GoD9titN', track: 'RegEx', inst: 'Learn With Naw', role: 'بديل معتمد' },

  // 11. R
  { id: 'PL1DUmTEdeA6LKTMW3wrlT3GiFMCL_r_Sn', track: 'R', inst: 'محمد الدسوقي', role: 'أساسي' }
];

// قوائم يوتيوب الرسمية المؤكدة لمسارات المرحلة 6 (الدفعة الثالثة - الذكاء الاصطناعي، الشبكات والأمن السيبراني، الأعمال واللغات)
export const STAGE6_PLAYLISTS = [
  // قطاع الشبكات والأمن السيبراني
  { id: 'PL7Gr36YWMQJfudBhButGVU-bCPpEP29f0', track: 'CCNA 200-301', inst: 'Ahmed Salama Academy', role: 'أساسي' },
  { id: 'PLZRbfAPIQNh_etXgCDAmF7-939z7uGe0P', track: 'CCNA 200-301', inst: 'Eng. Shahinaz Elkasrawy', role: 'بديل معتمد' },
  { id: 'PLped9VG7STA-SnQv4X9lauBZGH4rW8ICF', track: 'CCNA 200-301', inst: 'Abeer Hosni', role: 'بديل معتمد' },
  { id: 'PL77yNtB4-LjnN2FU3h1v5hIJOHZfW9ugq', track: 'CCNA 200-301', inst: 'Ahmed Nazmy', role: 'بديل معتمد' },
  { id: 'PLoP_aS_FoPQfCHLDULY7wmjz3Qgp5f7il', track: 'CCNA 200-301', inst: 'Helper For Training - Ahmed Hassan', role: 'بديل معتمد' },
  { id: 'PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ', track: 'CCNA 200-301', inst: "Jeremy's IT Lab", role: 'بديل معتمد' },
  { id: 'PLQQoSBmrXmrysEaVNia7KVwf85qATIi1V', track: 'CCNA 200-301', inst: 'Keith Barker', role: 'بديل معتمد' },
  { id: 'PLLlr6jKKdyK3C22AuU70h5xWe0ePmsbT7', track: 'CompTIA Security+', inst: 'FREE4ARAB - م. حسن صالح', role: 'أساسي' },
  { id: 'PLky4bd7_03m8o1NB0j96OsxZs0KcKlgMO', track: 'CompTIA Security+', inst: 'Netriders Academy', role: 'بديل معتمد' },
  { id: 'PLgIQibkrZYz2ILJG4WLv_CT8zUgicRcwV', track: 'CompTIA Security+', inst: 'Altechnologya', role: 'بديل معتمد' },
  { id: 'PLG49S3nxzAnl4QDVqK-hOnoqcSKEIDDuv', track: 'CompTIA Security+', inst: 'Professor Messer', role: 'بديل معتمد' },
  { id: 'PLv7cogHXoVhXvHPzIl1dWtBiYUAL8baHj', track: 'Web Penetration Testing', inst: 'Ebrahem', role: 'أساسي' },
  { id: 'PLDRMxi70CdSBHODkNy87kqqGUSnl0ASxg', track: 'Web Penetration Testing', inst: 'Cyber Guy', role: 'بديل معتمد' },
  { id: 'PLtr9ezc61PUb3iQMlvnicIC3BIra2BZId', track: 'Web Penetration Testing', inst: 'Hassan Saad', role: 'بديل معتمد' },
  { id: 'PLNvdtq6oHX8U', track: 'Web Penetration Testing', inst: 'Motasem Hamdan', role: 'بديل معتمد' },
  { id: 'PLLlr6jKKdyK39fb-fpv4l_1OKiZG0-p8d', track: 'CEH', inst: 'FREE4ARAB - م. محمود عاطف', role: 'أساسي' },
  { id: 'PL8WMeMsGLndd6k07bHJkhTEpSaseMOfLq', track: 'CEH', inst: 'الباشمبرمج', role: 'بديل معتمد' },
  { id: 'PLqi7yZF-SFcZrof7LTDqrZhJt2KuEQFx2', track: 'CEH', inst: 'iSecur1ty', role: 'بديل معتمد' },

  // قطاع الذكاء الاصطناعي وعلم البيانات
  { id: 'PL6-3IRz2XF5Ua2KG_Fl3lbZ-kKi3-Np0_', track: 'تعلم الآلة', inst: 'هشام عاصم', role: 'أساسي' },
  { id: 'PL5JZLxl_tFCcgAv9x2eXeX0_2TLRMnHUg', track: 'تعلم الآلة', inst: 'Khaled Mostafa Elsayed', role: 'بديل معتمد' },
  { id: 'PLtsZ69x5q-X9j44MdSX-NGuOhGXOY0aqH', track: 'تعلم الآلة', inst: 'Elgouhary AI', role: 'بديل معتمد' },
  { id: 'PL6-3IRz2XF5X-lzMZdmkvGAx1a3kIm7_I', track: 'التعلم العميق', inst: 'هشام عاصم', role: 'أساسي' },
  { id: 'PL5JZLxl_tFCcmulUU7suv9DkAFrOTm34w', track: 'التعلم العميق', inst: 'Khaled Mostafa Elsayed', role: 'بديل معتمد' },
  { id: 'PL6-3IRz2XF5WYpWu6Y8T3firJLflZ3Ufi', track: 'NLP', inst: 'هشام عاصم', role: 'أساسي' },
  { id: 'PL5JZLxl_tFCd-ixMkn_CJPQhhQRFhZXjY', track: 'NLP', inst: 'Khaled Mostafa Elsayed (Transformers)', role: 'بديل معتمد' },
  { id: 'PLYW0LRZ3ePo6IYDS2K5IhmuP5qY3dmI9e', track: 'علم البيانات', inst: 'Hussam Hourani', role: 'أساسي' },
  { id: 'PLUaOSLOIQPE13ciswpqfWQC5qzLePXQjx', track: 'أخبار الذكاء الاصطناعي', inst: 'Dr. Ahmed Al-Senosy', role: 'أساسي' },
  { id: 'PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto', track: 'n8n', inst: 'n8n بالعربي', role: 'أساسي' },
  { id: 'PLvmpljk9TE2vSdI6w5kb2ZIXQdWTiqLwF', track: 'n8n', inst: 'ذكاء اصطناعي عربي', role: 'بديل معتمد' },
  { id: 'PLygv9a61oO1MTO6Xd6-pC1VD5830NgR5T', track: 'فيديو الذكاء الاصطناعي', inst: 'زياد للمعلوماتيه', role: 'أساسي' },
  { id: 'PLlSkOgnexmrpCDErACdUn8pQtU-SijUeX', track: 'ذكاء اصطناعي عام', inst: 'الذكاء الاصطناعي بالعربية (@AI_Arabic1)', role: 'أساسي' },

  // قطاع الأعمال واللغات
  { id: 'PL-qR2lCbzf-qKcSx6v7IVz30G5A711xKA', track: 'Power BI', inst: 'Fouad Zawadi', role: 'أساسي' },
  { id: 'PLof3yw6ZFPFjQKcrPGlSXz3qGuL93MQme', track: 'Power BI', inst: 'المنذر سفان', role: 'بديل معتمد' },
  { id: 'PLX7gALGQvxQPB7S-hvlY-oIR0ZFTqKbnu', track: 'Power BI', inst: 'Khaled Shaaban', role: 'مكمل' },
  { id: 'PLZZaSsse59uYoSeU2gpx0899POZJL9Ze9', track: 'Power BI', inst: 'Learn With Dr Abdelrahman', role: 'مكمل' },
  { id: 'PLXlHqMRg9lAYiiutr-Ou0J1uU20T-5a4-', track: 'Excel الشامل', inst: 'Mohamed Al Assaal', role: 'أساسي' },
  { id: 'PLHEPOEqjBpoXTLxPvUBbiTtgPKZLM0UdI', track: 'Excel الشامل', inst: 'علمني اب', role: 'بديل معتمد' },
  { id: 'PLof3yw6ZFPFjik6ifGwXs68DLS60OPHYM', track: 'Excel الشامل', inst: 'المنذر سفان', role: 'بديل معتمد' },
  { id: 'PLNUk9qMoRCS-okWHL5wFErCW8gTrJjbry', track: 'Excel المحاسبي', inst: 'E-Accounting & ERP', role: 'أساسي' },
  { id: 'PLZyF0PRK2oMQ_NHLO79hkN_la45Q700RF', track: 'السيو', inst: 'E-Marketing Lovers', role: 'أساسي' },
  { id: 'PLHAAJ2zG7Uzn6F5hd-YLHtZrwlNuAPSNt', track: 'السيو', inst: 'شيماء المهدي', role: 'بديل معتمد' },
  { id: 'PL92kQtqBVlOMMatUyitVRnTXidPd11lRb', track: 'السيو', inst: 'كورس Teracourses', role: 'بديل معتمد' },
  { id: 'PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr', track: 'الإنجليزية', inst: 'ZAmericanEnglish', role: 'أساسي' },
  { id: 'PLjcu8DN2DuL4TWptae2RlFQoS9p0nKyMb', track: 'الإنجليزية', inst: 'Learn English with Ehab', role: 'بديل معتمد' },
  { id: 'PLcetZ6gSk969oGvAI0e4_PgVnlGbm64bp', track: 'الإنجليزية', inst: 'BBC Learning English', role: 'بديل معتمد' },
  { id: 'PLW0eXp-s-kGCEEQA-At45KOCamEyz8Fq9', track: 'الفرنسية', inst: 'فرنساوي', role: 'أساسي' },
  { id: 'PL8tN7PSHumdSN2EAP5-ui59iBPysTYFl6', track: 'الفرنسية', inst: 'La langue française', role: 'بديل معتمد' },
  { id: 'PLTSnwH2OTrraNHXkLHP8G96dpxwNSd85C', track: 'الفرنسية', inst: 'InnerFrench', role: 'بديل معتمد' },
  { id: 'PLkMQi7_Jt8pt4A2C-ZhoRHKt0AGVkVg9w', track: 'الألمانية', inst: 'Deutsch mit Hend', role: 'أساسي' },
  { id: 'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg', track: 'الألمانية', inst: 'Easy German', role: 'بديل معتمد' },
  { id: 'PLvr84R8yDNJZxVFRhIAdv-UGEj2KOA86n', track: 'الألمانية', inst: 'Get Germanized', role: 'بديل معتمد' }
];

export const ALL_TARGET_PLAYLISTS = [...STAGE4_PLAYLISTS, ...STAGE5_PLAYLISTS, ...STAGE6_PLAYLISTS];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    playlist: null,
    query: null,
    course: null,
    limit: 500,
    save: true,
    stage4: false,
    stage5: false,
    stage6: false,
    all: false,
    force: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--playlist' || arg === '-p') {
      options.playlist = args[++i];
    } else if (arg === '--query' || arg === '-q') {
      options.query = args[++i];
    } else if (arg === '--course' || arg === '-c') {
      options.course = args[++i];
    } else if (arg === '--limit' || arg === '-l') {
      options.limit = parseInt(args[++i], 10) || 500;
    } else if (arg === '--stage4') {
      options.stage4 = true;
    } else if (arg === '--stage5' || arg === '--batch') {
      options.stage5 = true;
    } else if (arg === '--stage6') {
      options.stage6 = true;
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--no-save') {
      options.save = false;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
محرك AIProdZone لمزامنة قوائم يوتيوب الرسمية بدون أي هلوسة (Zero-Hallucination Engine)

الخيارات المتاحة:
  --stage6                   مزامنة قوائم المرحلة 6 (الذكاء الاصطناعي + الشبكات والأمن + الأعمال واللغات)
  --stage5, --batch          مزامنة قوائم المرحلة 5 (علوم الحاسوب + قواعد البيانات + DevOps)
  --stage4                   مزامنة قوائم المرحلة 4 (الويب + لغات وتطبيقات)
  --all                      مزامنة كافة القوائم المعتمدة للمراحل 4 و 5 و 6
  --playlist, -p <id|url>    جلب بيانات قائمة تشغيل محددة بواسطة الرابط أو المعرف
  --query, -q <text>         البحث في يوتيوب عن اسم القناة والدورة وجلب أول قائمة مطابقة
  --course, -c <courseId>    مزامنة دورة معتمدة من دليل المنصة (مثال: python-masterclass)
  --force, -f                إعادة جلب القوائم حتى لو كانت محفوظة في الكاش
  --limit, -l <num>          الحد الأقصى لعدد الدروس المراد جلبها (افتراضي: 500)
  --no-save                  طباعة البيانات دون حفظها في ملف الكاش
  --help, -h                 عرض دليل الاستخدام
`);
}

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('تعذر قراءة ملف الكاش القديم:', err.message);
  }
  return {};
}

function saveCache(cache) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');

    const realPlaylistsFile = path.join(ROOT_DIR, 'src', 'data', 'real-playlists.js');
    const jsContent = `/**\n * بيانات قوائم يوتيوب الرسمية المستخرجة بمحرك Zero-Hallucination\n */\nexport const REAL_YOUTUBE_PLAYLISTS = ${JSON.stringify(cache, null, 2)};\n`;
    fs.writeFileSync(realPlaylistsFile, jsContent, 'utf8');
  } catch (err) {
    console.error('فشل حفظ ملف الكاش:', err.message);
  }
}

async function syncPlaylists(targetList, label, options) {
  console.log('='.repeat(70));
  console.log(` 🚀 بدء مزامنة: ${label} (${targetList.length} قائمة بكافة المحاضرين)`);
  console.log('='.repeat(70));

  const cache = loadCache();
  let fetchedCount = 0;
  let cachedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < targetList.length; i++) {
    const item = targetList[i];
    const prefix = `[${(i + 1).toString().padStart(2, '0')}/${targetList.length}] ${item.track} - ${item.inst}`;

    // التحقق من وجود القائمة في الكاش واحتوائها على فيديوهات
    if (!options.force && cache[item.id] && Array.isArray(cache[item.id].videos) && cache[item.id].videos.length > 0) {
      cachedCount++;
      const vCount = cache[item.id].videos.length;
      console.log(`✓ ${prefix}: محفوظ مسبقاً (${vCount} درساً مرتباً) [${item.id}]`);
      continue;
    }

    console.log(`⏳ ${prefix}: جاري جلب القائمة من يوتيوب... [${item.id}]`);
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const details = await fetchPlaylistDetails(item.id, {
          fetchAll: true,
          maxVideos: options.limit
        });

        cache[item.id] = {
          ...details,
          track: item.track,
          instructor: item.inst,
          role: item.role,
          updatedAt: new Date().toISOString()
        };

        if (options.save) {
          saveCache(cache);
        }

        fetchedCount++;
        success = true;
        console.log(`   ✅ تم الجلب بنجاح: ${details.title} (${details.videos.length} درساً مرتباً)`);
      } catch (err) {
        if (attempts >= 3) {
          errorCount++;
          console.error(`   ❌ فشل جلب القائمة [${item.id}]: ${err.message}`);
        } else {
          await new Promise((r) => setTimeout(r, 1500 * attempts));
        }
      }
    }

    // تأخير لطيف بين الطلبات لتفادي حظر يوتيوب
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log('\n' + '='.repeat(70));
  console.log(' 📊 تقرير مزامنة يوتيوب (Zero-Hallucination Sync Report):');
  console.log(`  - إجمالي القوائم المستهدفة:  ${targetList.length}`);
  console.log(`  - القوائم المستخرجة حديثاً: ${fetchedCount}`);
  console.log(`  - القوائم الجاهزة من الكاش: ${cachedCount}`);
  console.log(`  - الأخطاء:                 ${errorCount}`);
  console.log(`  - إجمالي القوائم في الكاش:   ${Object.keys(cache).length}`);
  console.log('='.repeat(70));
}

async function main() {
  const options = parseArgs();

  if (options.all) {
    await syncPlaylists(ALL_TARGET_PLAYLISTS, 'كافة المسارات المعتمدة (المراحل 4 و 5 و 6)', options);
    return;
  }

  if (options.stage6) {
    await syncPlaylists(STAGE6_PLAYLISTS, 'الدفعة الثالثة (المرحلة 6: الذكاء الاصطناعي + الشبكات والأمن + الأعمال واللغات)', options);
    return;
  }

  if (options.stage5) {
    await syncPlaylists(STAGE5_PLAYLISTS, 'الدفعة الثانية (المرحلة 5: علوم الحاسوب + قواعد البيانات + DevOps)', options);
    return;
  }

  if (options.stage4) {
    await syncPlaylists(STAGE4_PLAYLISTS, 'الدفعة الأولى (المرحلة 4: الويب + لغات وتطبيقات)', options);
    return;
  }

  console.log('='.repeat(65));
  console.log(' 🚀 محرك AIProdZone لجلب قوائم يوتيوب الحقيقية (Zero-Hallucination)');
  console.log('='.repeat(65));

  let targetPlaylistId = null;

  // 1. إذا تم تمرير معرف أو رابط قائمة مباشرة
  if (options.playlist) {
    targetPlaylistId = parsePlaylistId(options.playlist);
    if (!targetPlaylistId) {
      console.error(`❌ معرّف قائمة التشغيل غير صالح: ${options.playlist}`);
      process.exit(1);
    }
    console.log(`🔍 تم تحديد معرّف القائمة المستهدفة: ${targetPlaylistId}`);
  }
  // 2. إذا تم تمرير استعلام بحث
  else if (options.query) {
    console.log(`🔎 جاري البحث في يوتيوب عن: "${options.query}" ...`);
    const searchResults = await searchYouTubePlaylists(options.query, { limit: 3 });

    if (searchResults.length === 0) {
      console.error('❌ لم يتم العثور على أي قائمة تشغيل مطابقة في يوتيوب.');
      process.exit(1);
    }

    console.log(`✓ تم العثور على ${searchResults.length} نتائج. القائمة المختارة:`);
    console.log(`  - العنوان: ${searchResults[0].title}`);
    console.log(`  - القناة:  ${searchResults[0].channelTitle}`);
    console.log(`  - المعرّف:  ${searchResults[0].playlistId}`);

    targetPlaylistId = searchResults[0].playlistId;
  }
  // 3. افتراضياً: تشغيل مزامنة المرحلة 5
  else {
    await syncPlaylists(STAGE5_PLAYLISTS, 'الدفعة الثانية (المرحلة 5: علوم الحاسوب + قواعد البيانات + DevOps)', options);
    return;
  }

  console.log(`\n⏳ جاري استخراج تفاصيل القائمة والفيديوهات المرتبة من يوتيوب...`);
  const startTime = Date.now();
  const playlistData = await fetchPlaylistDetails(targetPlaylistId, {
    fetchAll: true,
    maxVideos: options.limit
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ تم الانتهاء بنجاح في ${elapsed} ثانية:`);
  console.log(`  - عنوان القائمة:     ${playlistData.title}`);
  console.log(`  - صاحب القناة:       ${playlistData.channelTitle}`);
  console.log(`  - إجمالي الفيديوهات: ${playlistData.videoCount}`);
  console.log(`  - الفيديوهات المستخرجة: ${playlistData.videos.length} درساً مرتباً`);
  console.log(`  - صورة الغلاف:      ${playlistData.thumbnail}`);

  if (playlistData.videos.length > 0) {
    console.log('\nنموذج من الدروس المستخرجة الحقيقية:');
    const samples = [
      playlistData.videos[0],
      playlistData.videos[Math.min(99, playlistData.videos.length - 1)],
      playlistData.videos[playlistData.videos.length - 1]
    ];

    samples.forEach((v) => {
      console.log(
        `  [#${v.index.toString().padStart(3, '0')}] ${v.videoId} | ${v.duration.padEnd(6)} | ${v.title}`
      );
    });
  }

  if (options.save) {
    const cache = loadCache();
    cache[playlistData.playlistId] = {
      ...playlistData,
      updatedAt: new Date().toISOString()
    };
    saveCache(cache);
    console.log(`✓ تم حفظ القائمة في الكاش وملف الكود البرمجي.`);
  }
}

main().catch((err) => {
  console.error('\n❌ خطأ أثناء تشغيل المحرك:', err);
  process.exit(1);
});
