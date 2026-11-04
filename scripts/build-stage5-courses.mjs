import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const COURSES_FILE = path.join(ROOT_DIR, 'src', 'data', 'courses.js');
const STAGE4_BUILD_FILE = path.join(ROOT_DIR, 'scripts', 'build-stage4-courses.mjs');

// 1. Read the base of build-stage4-courses.mjs up to the end of Track 29 (Unity)
const stage4Content = fs.readFileSync(STAGE4_BUILD_FILE, 'utf8');

// Find the start of INITIAL_COURSES and the end of Unity track
const startMarker = '// 1. بايثون (Python)';
const endMarker = '  // ==========================================\n  // ثالثاً: مسارات القطاعات الأكاديمية الـ 6 الأخرى';

const headerPart = stage4Content.substring(0, stage4Content.indexOf(endMarker));

// 2. Define the 25 tracks for Stage 5
const stage5TracksCode = `  // ==========================================
  // ثالثاً: قطاع علوم الحاسوب (8 مسارات)
  // ==========================================

  // 30. الخوارزميات (Algorithms)
  createCourseTrack({
    id: 'algorithms-masterclass',
    title: 'الخوارزميات وحل المسائل البرمجية (Algorithms & Problem Solving)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 خوارزميات',
    methodologyNote: 'المسار التأسيسي لفهم منطق الخوارزميات، تحليل التعقيد الزمني والمكاني Big-O، وحل مسائل المقابلات التقنية.',
    rankOrder: 1,
    orderIndex: 30,
    featured: true,
    trending: true,
    viewsCount: 520000,
    toolsSummary: 'Algorithms, Big-O, Sorting, Searching, Recursion, Dynamic Programming',
    techStack: ['Algorithms', 'Data Structures', 'Problem Solving', 'Big-O', 'LeetCode'],
    instructors: [
      {
        id: 'inst-hardcode-algo',
        name: 'محمود سامي (Hard-Code)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '8 ساعات تدريبية',
        note: 'شرح مبسط وتطبيقي لأهم خوارزميات الترتيب والبحث والتعقيد الزمني (15 درساً مرتباً ✔)',
        playlistId: 'PLwCMLs3sjOY6KH-8c9F-lMWn-r02hyoV_',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-adel-nasim-algo',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '16 ساعة تدريبية',
        note: 'دورة شاملة ومفصلة في تحليل الخوارزميات وتراكيب البيانات المتقدمة مع تمارين C++ العملية',
        playlistId: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-desouki-algo',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 14,
        durationText: '10 ساعات تدريبية',
        note: 'المنهج الأكاديمي الجامعي لشرح خوارزميات البيانات والبحث والترتيب بأسلوب عميق ومتقن',
        playlistId: 'PL1DUmTEdeA6JlommmGP5wicYLxX5PVCQt',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      }
    ]
  }),

  // 31. هياكل البيانات (Data Structures)
  createCourseTrack({
    id: 'data-structures-masterclass',
    title: 'هياكل وتراكيب البيانات المتقدمة (Data Structures Course)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 هياكل بيانات',
    methodologyNote: 'فهم متعمق لكيفية تنظيم الذاكرة والتعامل مع Arrays, Linked Lists, Stacks, Queues, Trees, Graphs.',
    rankOrder: 2,
    orderIndex: 31,
    featured: true,
    viewsCount: 480000,
    toolsSummary: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graphs, Hash Tables',
    techStack: ['Data Structures', 'C++', 'Memory', 'Trees', 'Graphs'],
    instructors: [
      {
        id: 'inst-adel-nasim-ds',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '16 ساعة تدريبية',
        note: 'الكورس المرجعي العربي الأشهر لشرح وتطبيق تراكيب البيانات بلغة C++ من الصفر حتى الاحتراف',
        playlistId: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-hardcode-ds',
        name: 'محمود سامي (Hard-Code)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 31,
        durationText: '12 ساعة تدريبية',
        note: 'دورة عملية رائعة تبسط هياكل البيانات والتطبيقات البرمجية الواقعية خطوة بخطوة',
        playlistId: 'PLwCMLs3sjOY4UQq4vXgGPwGLVX1Y5faaS',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-nehal-elsamoly-ds',
        name: 'نهال السامولي (Nehal Elsamoly)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '6 ساعات تدريبية',
        note: 'شرح متميز ومبسط لهياكل البيانات التأسيسية وأهم المفاهيم للطلاب والمبتدئين',
        playlistId: 'PLIxq078xdGdZWUXwumK9lbEn3kKwKLTwx',
        channelUrl: 'https://youtube.com/@NehalElsamoly'
      }
    ]
  }),

  // 32. Assembly
  createCourseTrack({
    id: 'assembly-masterclass',
    title: 'لغة التجميع والبرمجة منخفضة المستوى x86 Assembly Language',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'منخفض المستوى',
    methodologyNote: 'الغوص في أعماق المعالج (CPU Registers, Memory Addressing, Stack Frame) وكتابة كود الأسمبلي المباشر.',
    rankOrder: 3,
    orderIndex: 32,
    viewsCount: 260000,
    toolsSummary: 'x86, 8086, Registers, Assembly, Low-Level, Debugging, Emulator',
    techStack: ['Assembly', 'x86', 'Microprocessors', 'Low-Level'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-assembly',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 30,
        durationText: '14 ساعة تدريبية',
        note: 'شرح أكاديمي دقيق ومفصل للغة التجميع x86 ومعمارية المعالجات والتعامل مع المسجلات',
        playlistId: 'PLMm8EjqH1EFVodghdDWaAuHkHqj-nJ0bN',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      },
      {
        id: 'inst-sherif-ezzat-assembly',
        name: 'شريف عزت (Sherif Ezzat)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 46,
        durationText: '18 ساعة تدريبية',
        note: 'دورة معالج 8086 وتطبيقات لغة الأسمبلي العملية والتحكم في العتاد والذاكرة',
        playlistId: 'PLi0-RQZxQ8Fmwopq43StX61igOvXbFMQv',
        channelUrl: 'https://youtube.com/@SherifEzzat'
      }
    ]
  }),

  // 33. معمارية الحاسوب (Computer Architecture)
  createCourseTrack({
    id: 'computer-architecture-masterclass',
    title: 'تنظيم وبناء ومعمارية الحاسب (Computer Architecture)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'عتاد وأنظمة',
    methodologyNote: 'دراسة الدوائر المنطقية ووحدات المعالجة المركزية، خطوط النقل، مسار البيانات، وهيكلية الذاكرة المخبأة Cache.',
    rankOrder: 4,
    orderIndex: 33,
    viewsCount: 240000,
    toolsSummary: 'ALU, Control Unit, Pipelining, Caching, Instruction Set Architecture (ISA)',
    techStack: ['Computer Architecture', 'Hardware', 'Pipelining', 'ISA'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-ca',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 27,
        durationText: '12 ساعة تدريبية',
        note: 'المسار الأكاديمي الشامل لتنظيم وبناء الحاسب وتصميم وحدات المعالجة والذاكرة (27 درساً مرتباً ✔)',
        playlistId: 'PLMm8EjqH1EFVEVWSiBdCoBEJHffjHUScZ',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      }
    ]
  }),

  // 34. أنظمة التشغيل (Operating Systems)
  createCourseTrack({
    id: 'operating-systems-masterclass',
    title: 'هندسة ونظم التشغيل المعاصرة (Operating Systems Concepts)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 أنظمة',
    methodologyNote: 'إتقان مفاهيم العمليات Processes، الخيوط Threads، الجدولة CPU Scheduling، التزامن والمزامنة وإدارة الذاكرة.',
    rankOrder: 5,
    orderIndex: 34,
    featured: true,
    viewsCount: 390000,
    toolsSummary: 'Processes, Threads, Semaphores, Deadlocks, Paging, Virtual Memory',
    techStack: ['Operating Systems', 'Concurrency', 'Memory Management', 'Kernel'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-os',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '14 ساعة تدريبية',
        note: 'شرح أكاديمي متميز ومترابط لكتاب نظم التشغيل المعتمد عالمياً ونظريات إدارة العمليات',
        playlistId: 'PLMm8EjqH1EFV-jECqtMxeVMDoVkV_kJDY',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      },
      {
        id: 'inst-ahmed-hagag-os',
        name: 'د. أحمد حجاج (Dr. Ahmed Hagag)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 21,
        durationText: '10 ساعات تدريبية',
        note: 'محاضرات جامعية قيمة ومفصلة لشرح نظم التشغيل وحل المسائل العملية والجدولة',
        playlistId: 'PLxIvc-MGOs6ib0oK1z9C46DeKd9rRcSMY',
        channelUrl: 'https://youtube.com/@AhmedHagag'
      },
      {
        id: 'inst-mohamed-alsayed-os',
        name: 'محمد السيد (SoftwareTube / Mohamed Alnaqid)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 60,
        durationText: '25 ساعة تدريبية',
        note: 'شرح موسع لكتاب Dinosaur Book مع تفصيل دقيق لجميع فصول نظم التشغيل الحديثة (60 درساً ✔)',
        playlistId: 'PLTr1xN4uMK5seRz6IO7Am9Zp2UKdnzO_n',
        channelUrl: 'https://youtube.com/@SoftwareTube'
      }
    ]
  }),

  // 35. Linux
  createCourseTrack({
    id: 'linux-system-masterclass',
    title: 'إدارة وتشغيل خوادم وأنظمة لينكس (Linux System Administration)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'نظام التشغيل القياسي',
    methodologyNote: 'إتقان سطر الأوامر Bash، أذونات الملفات، إدارة العمليات والخدمات، والشبكات في نظام لينكس.',
    rankOrder: 6,
    orderIndex: 35,
    viewsCount: 310000,
    toolsSummary: 'Bash, Terminal, Permissions, Systemd, Package Managers, Networking, SSH',
    techStack: ['Linux', 'Ubuntu', 'Bash', 'System Administration', 'Terminal'],
    instructors: [
      {
        id: 'inst-anahr-linux',
        name: 'أنس النهر (anaHr)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '6 ساعات تدريبية',
        note: 'سلسلة مميزة واحترافية لتعلم نظام لينكس وسطر الأوامر وإدارة الخوادم (12 درساً مرتباً ✔)',
        playlistId: 'PL8pYI62gCNsWTppELEUCpforC4avEiLox',
        channelUrl: 'https://youtube.com/@anaHr'
      }
    ]
  }),

  // 36. Prolog
  createCourseTrack({
    id: 'prolog-programming-masterclass',
    title: 'البرمجة المنطقية والذكاء الاصطناعي بلغة برولوج (Prolog Logic Programming)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'برمجة منطقية',
    methodologyNote: 'فهم نمط البرمجة التصريحية وبناء قواعد المعرفة والقواعد المنطقية والاستدلال في الذكاء الاصطناعي.',
    rankOrder: 7,
    orderIndex: 36,
    viewsCount: 180000,
    toolsSummary: 'Prolog, Knowledge Bases, Facts, Rules, Inference, Logic Programming',
    techStack: ['Prolog', 'Logic Programming', 'AI', 'Inference'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-prolog',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 26,
        durationText: '10 ساعات تدريبية',
        note: 'الكورس العربي الأكمل والأوضح في البرمجة المنطقية بلغة Prolog وتطبيقات الذكاء الاصطناعي (26 درساً ✔)',
        playlistId: 'PLMm8EjqH1EFW9Faldu6D6Uh2j1EWWaTYe',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      }
    ]
  }),

  // 37. CS50 بالعربي
  createCourseTrack({
    id: 'cs50-arabic-masterclass',
    title: 'مقدمة علوم الحاسوب لجامعة هارفارد بالعربي (CS50 in Arabic)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 مدخل الحاسوب',
    examCode: 'CS50x Harvard',
    methodologyNote: 'المدخل الأسطوري لعلوم الحاسوب وبناء التفكير الخوارزمي، يبدأ من الصفر وصولاً إلى C وبايثون وتطوير الويب.',
    rankOrder: 8,
    orderIndex: 37,
    featured: true,
    trending: true,
    viewsCount: 950000,
    toolsSummary: 'C, Python, SQL, Memory, Pointers, Algorithms, Web Development',
    techStack: ['CS50', 'Computer Science', 'C', 'Python', 'Algorithms'],
    instructors: [
      {
        id: 'inst-kmr-cs50',
        name: 'كيه إم آر (KMR Script)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '12 ساعة تدريبية',
        note: 'شرح ممتع وعصري ومبسط لأهم مفاهيم كورس هارفارد CS50 بالعربي مع التطبيق البرمجي',
        playlistId: 'PLL2zWZTDFZzibJ49gBM2owqCzda8meSNj',
        channelUrl: 'https://youtube.com/@KMRScript'
      },
      {
        id: 'inst-rasha-abdeen-cs50',
        name: 'رشا عابدين (Coders Camp - Rasha Abdeen)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 123,
        durationText: '40 ساعة تدريبية',
        note: 'موسوعة عربية كاملة وتفصيلية تغطي محاضرات ومسائل وتطبيقات منهج هارفارد CS50 كاملاً (123 درساً ✔)',
        playlistId: 'PLnrlZUDQofUv7JE4QIahAyztrQU9bnJmd',
        channelUrl: 'https://youtube.com/@CodersCamp'
      },
      {
        id: 'inst-abdelrahman-gamal-cs50',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 82,
        durationText: '24 ساعة تدريبية',
        note: 'شرح تطبيقي سلس وتفاعلي لكورس CS50 مع حل المسائل ومساعدة المبتدئين خطوة بخطوة (82 درساً ✔)',
        playlistId: 'PLknwEmKsW8OvMsFbU9zo8oJCprAsgc4LO',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      }
    ]
  }),

  // ==========================================
  // رابعاً: قطاع قواعد البيانات والخلفية (6 مسارات)
  // ==========================================

  // 38. قواعد البيانات (نظري)
  createCourseTrack({
    id: 'database-theory-masterclass',
    title: 'المفاهيم النظرية ونظم إدارة قواعد البيانات (Database Systems Concepts)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'المرتبة #1 نظري',
    methodologyNote: 'تأسيس أكاديمي لا غنى عنه في تصميم المخططات ERD، العلاقات، التفكيك والتوحيد Normalization، وقواعد البيانات العلائقية.',
    rankOrder: 1,
    orderIndex: 38,
    featured: true,
    viewsCount: 410000,
    toolsSummary: 'ERD, Relational Model, Normalization, Relational Algebra, Functional Dependencies',
    techStack: ['Database Design', 'ERD', 'Normalization', 'Relational Model'],
    instructors: [
      {
        id: 'inst-desouki-db-theory',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 40,
        durationText: '20 ساعة تدريبية',
        note: 'المرجع الجامعي العربي الأقوى لمقرر قواعد البيانات النظري وتصميم ERD والـ Normalization (40 درساً ✔)',
        playlistId: 'PL37D52B7714788190',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      },
      {
        id: 'inst-kmr-db-theory',
        name: 'كيه إم آر (KMR Script)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 13,
        durationText: '6 ساعات تدريبية',
        note: 'شرح عصري ومكثف لأساسيات قواعد البيانات وهندسة النظم الخلفية (13 درساً مرتباً ✔)',
        playlistId: 'PLL2zWZTDFZzhXQ1bcYlO3PtN4MsLiG-gy',
        channelUrl: 'https://youtube.com/@KMRScript'
      }
    ]
  }),

  // 39. SQL
  createCourseTrack({
    id: 'sql-masterclass',
    title: 'لغة الاستعلامات البنيوية وقواعد البيانات المترابطة (SQL & MySQL Mastery)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'المرتبة #1 استعلامات',
    methodologyNote: 'كتابة استعلامات SQL المتقدمة، الفهارس، المعاملات، الروابط Joins، وتصميم قواعد البيانات الإنتاجية.',
    rankOrder: 2,
    orderIndex: 39,
    featured: true,
    trending: true,
    viewsCount: 890000,
    toolsSummary: 'SQL, MySQL, Joins, Aggregations, Subqueries, Indexes, Transactions',
    techStack: ['SQL', 'MySQL', 'Database', 'Queries', 'RDBMS'],
    instructors: [
      {
        id: 'inst-elzero-mysql',
        name: 'أسامة محمد (الزيرو - Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 51,
        durationText: '12 ساعة تدريبية',
        note: 'دورة MySQL الاحترافية الشاملة مع التطبيقات العملية والاستعلامات المتقدمة (51 درساً مرتباً ✔)',
        playlistId: 'PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-desouki-sql',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 55,
        durationText: '22 ساعة تدريبية',
        note: 'مقرر SQL العملي التطبيقي الشامل من الصفر حتى إتقان إدارة الخوادم وقواعد البيانات (55 درساً ✔)',
        playlistId: 'PL85D9FC9DFD6B9484',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      },
      {
        id: 'inst-thenewbaghdad-sql',
        name: 'حسين الربيعي (TheNewBaghdad)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '10 ساعات تدريبية',
        note: 'بناء قواعد البيانات بكفاءة عالية وتطبيق استعلامات MySQL خطوة بخطوة (37 درساً مرتباً ✔)',
        playlistId: 'PLF8OvnCBlEY25O_Ql0CrgQUAc5NVYkWF2',
        channelUrl: 'https://youtube.com/@TheNewBaghdad'
      }
    ]
  }),

  // 40. MongoDB
  createCourseTrack({
    id: 'mongodb-masterclass',
    title: 'قواعد البيانات غير العلائقية وتطوير الوثائق MongoDB (NoSQL Database)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'NoSQL #1',
    methodologyNote: 'التعامل مع قواعد بيانات الوثائق BSON/JSON، عمليات CRUD، خطوط التجميع Aggregation Framework، وتكامل خوادم الويب.',
    rankOrder: 3,
    orderIndex: 40,
    viewsCount: 340000,
    toolsSummary: 'MongoDB, NoSQL, BSON, Aggregations, Indexing, Atlas, Mongoose',
    techStack: ['MongoDB', 'NoSQL', 'Database', 'Backend', 'Mongoose'],
    instructors: [
      {
        id: 'inst-algorithm-academy-mongo',
        name: 'أسامة جيدري (Algorithm Academy)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 10,
        durationText: '4 ساعات تدريبية',
        note: 'دورة ممتازة وعملية لتعلم MongoDB وتطبيقات NoSQL مع بيئة Node.js (10 دروس مرتبة ✔)',
        playlistId: 'PLfDx4cQoUNObp1ujQRNooNiadKdlflevM',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      },
      {
        id: 'inst-emam-academy-mongo',
        name: 'محمد إمام (Emam Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '5 ساعات تدريبية',
        note: 'شرح تطبيقي لـ MongoDB والربط مع خوادم Express وبناء الـ RESTful APIs (12 درساً ✔)',
        playlistId: 'PLGhZWewM_75IILJm_1QDq0yPLbLQz_TCb',
        channelUrl: 'https://youtube.com/@EmamAcademy'
      },
      {
        id: 'inst-thenewbaghdad-mongo',
        name: 'حسين الربيعي (TheNewBaghdad)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '4 ساعات تدريبية',
        note: 'شرح مبسّط لقواعد بيانات الوثائق MongoDB وتطبيق الاستعلامات الأساسية (11 درساً مرتباً ✔)',
        playlistId: 'PLF8OvnCBlEY1sdUym7Cnb5Xc3d7HXLjqf',
        channelUrl: 'https://youtube.com/@TheNewBaghdad'
      }
    ]
  }),

  // 41. Redis
  createCourseTrack({
    id: 'redis-masterclass',
    title: 'التخزين المؤقت في الذاكرة وهيكلة البيانات السريعة مع Redis (In-Memory Data Store)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'أداء فائق',
    methodologyNote: 'تسريع استجابة الخوادم، التخزين المؤقت Caching، نشر الرسائل Pub/Sub، وهندسة العناقيد Redis Cluster.',
    rankOrder: 4,
    orderIndex: 41,
    viewsCount: 290000,
    toolsSummary: 'Redis, In-Memory, Key-Value, Pub/Sub, Caching, Persistence, Cluster',
    techStack: ['Redis', 'Caching', 'In-Memory', 'High Performance', 'PubSub'],
    instructors: [
      {
        id: 'inst-anjrini-redis',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 68,
        durationText: '24 ساعة تدريبية',
        note: 'الموسوعة العربية الأضخم والأعمق لتقنية Redis بالعربي مع هندسة البيانات المتقدمة (68 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm_ijqLfnx94qkmytbWjUQ-h',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 42. Elastic
  createCourseTrack({
    id: 'elastic-elk-masterclass',
    title: 'محرك البحث والتحليلات الضخمة وحزمة ELK Stack & Elasticsearch',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'محرك بحث متقدم',
    methodologyNote: 'البحث النصي الكامل Full-Text Search، فهرسة السجلات Logs، وتحليل البيانات اللحظية عبر حزمة ELK.',
    rankOrder: 5,
    orderIndex: 42,
    viewsCount: 220000,
    toolsSummary: 'Elasticsearch, Logstash, Kibana, Beats, Shards, Replicas, Full-Text Search',
    techStack: ['Elasticsearch', 'ELK Stack', 'Kibana', 'Log Analysis', 'Search'],
    instructors: [
      {
        id: 'inst-anjrini-elastic',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 8,
        durationText: '5 ساعات تدريبية',
        note: 'شرح تطبيقي لحزمة ELK Stack وتثبيت وضبط محرك Elasticsearch والفهارس (8 دروس مرتبة ✔)',
        playlistId: 'PLahnTWf-ROoXRZQp4iWrzkRfTjrPjSw3W',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 43. RabbitMQ
  createCourseTrack({
    id: 'rabbitmq-masterclass',
    title: 'وسائط الرسائل والمعمارية غير المتزامنة بواسطة RabbitMQ (Message Broker)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'معمارية متزامنة',
    methodologyNote: 'إتقان بروتوكول AMQP، أنماط التبادل Exchanges، طوابير الرسائل Queues، والاتصال غير المتزامن بين الخوادم.',
    rankOrder: 6,
    orderIndex: 43,
    viewsCount: 260000,
    toolsSummary: 'RabbitMQ, AMQP, Exchanges, Queues, Routing, Asynchronous Messaging, Microservices',
    techStack: ['RabbitMQ', 'Message Broker', 'AMQP', 'Async', 'Event-Driven'],
    instructors: [
      {
        id: 'inst-anjrini-rabbitmq',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 44,
        durationText: '18 ساعة تدريبية',
        note: 'الدورة العربية المتكاملة والأشمل لنظام وسائط الرسائل RabbitMQ وبناء النظم الموزعة (44 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm9uJ2J5ryEOZV7ojLwGkATc',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // ==========================================
  // خامساً: قطاع DevOps والسحابة والهندسة (11 مساراً)
  // ==========================================

  // 44. Git
  createCourseTrack({
    id: 'git-github-masterclass',
    title: 'إدارة الإصدارات والعمل الجماعي البرمجي باستخدام Git & GitHub',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 إدارة شيفرات',
    methodologyNote: 'التحكم بالإصدارات، الفروع Branches، الدمج Merge، الـ Pull Requests، وحل النزاعات البرمجية بكفاءة.',
    rankOrder: 1,
    orderIndex: 44,
    featured: true,
    trending: true,
    viewsCount: 780000,
    toolsSummary: 'Git, GitHub, Branching, Merging, Rebase, Pull Requests, Workflows',
    techStack: ['Git', 'GitHub', 'Version Control', 'DevOps', 'Collaboration'],
    instructors: [
      {
        id: 'inst-elzero-git',
        name: 'أسامة محمد (الزيرو - Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 32,
        durationText: '7 ساعات تدريبية',
        note: 'دورة Git و GitHub الأشهر عربياً مع التطبيق العملي وإدارة الفروع والمستودعات (32 درساً مرتباً ✔)',
        playlistId: 'PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-khalid-elshafie-git',
        name: 'خالد الشافعي (Khalid Elshafie - abolkog)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 8,
        durationText: '4 ساعات تدريبية',
        note: 'شرح تطبيقي مكثف ومباشر لأساسيات Git وسير العمل الجماعي على GitHub (8 دروس مرتبة ✔)',
        playlistId: 'PL_aOZuct6oAogr4UMkWddU7leOXw0QKJS',
        channelUrl: 'https://youtube.com/@KhalidElshafie'
      },
      {
        id: 'inst-tarmeez-git',
        name: 'أكاديمية ترميز (Tarmeez Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 13,
        durationText: '5 ساعات تدريبية',
        note: 'الدورة الأساسية في Git للمطورين بأسلوب ميسر وتطبيقات شائعة (13 درساً مرتباً ✔)',
        playlistId: 'PLYyqC4bNbCIeCHLTRtwdLpQvle_zIavZ-',
        channelUrl: 'https://youtube.com/@tarmeez'
      }
    ]
  }),

  // 45. Docker
  createCourseTrack({
    id: 'docker-masterclass',
    title: 'تقنيات الحاويات وعزل البيئات البرمجية بواسطة Docker (Containers in Depth)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 حاويات',
    methodologyNote: 'بناء ملفات Dockerfile، إدارة الصور والحاويات، شبكات الدوكر، والتكامل عبر Docker Compose.',
    rankOrder: 2,
    orderIndex: 45,
    featured: true,
    trending: true,
    viewsCount: 650000,
    toolsSummary: 'Docker, Dockerfile, Docker Compose, Images, Containers, Volumes, Networks',
    techStack: ['Docker', 'DevOps', 'Containers', 'Microservices', 'Linux'],
    instructors: [
      {
        id: 'inst-codographia-docker',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '14 ساعة تدريبية',
        note: 'سلسلة احترافية شاملة ومبوبة لشرح دوكر من الصفر وحتى مفاهيم الإنتاج الحقيقية (37 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-tresmerge-docker',
        name: 'تريسميرج (Tresmerge)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '11 ساعة تدريبية',
        note: 'دورة تطبيقية عملية باللغة العربية لشرح دوكر والحاويات بالتفصيل (28 درساً مرتباً ✔)',
        playlistId: 'PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR',
        channelUrl: 'https://youtube.com/@Tresmerge'
      },
      {
        id: 'inst-ahmed-sami-docker',
        name: 'أحمد سامي (Ahmed Sami - بالعربي Big Data)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 77,
        durationText: '28 ساعة تدريبية',
        note: 'مسار DevOps والحاويات الشامل وشرح دوكر وكوبرنيتس الميداني بالتفصيل (77 درساً مرتباً ✔)',
        playlistId: 'PLJK0gWS0uZDYdUuQBJLhUakQ_09qWMSb_',
        channelUrl: 'https://youtube.com/@AhmedSami'
      }
    ]
  }),

  // 46. Kubernetes
  createCourseTrack({
    id: 'kubernetes-masterclass',
    title: 'إدارة وتنسيق عناقيد الحاويات على مستوى الإنتاج بواسطة Kubernetes (K8s)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 كوبرنيتس',
    methodologyNote: 'إدارة Pods, Deployments, Services, Ingress, التوسع التلقائي Auto-scaling، ونشر الأنظمة السحابية المعقدة.',
    rankOrder: 3,
    orderIndex: 46,
    featured: true,
    viewsCount: 430000,
    toolsSummary: 'Kubernetes, Pods, Deployments, Services, Helm, Ingress, ConfigMaps, Secrets',
    techStack: ['Kubernetes', 'K8s', 'Cloud Native', 'DevOps', 'Containers'],
    instructors: [
      {
        id: 'inst-codographia-k8s',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 39,
        durationText: '16 ساعة تدريبية',
        note: 'الدورة العربية الأقوى والأشمل لشرح كوبرنيتس بالعربي وتطبيقات الـ Orchestration (39 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhDCHijCrMO5F-oHg52rRBpl',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-ahmed-elemam-k8s',
        name: 'أحمد الإمام (Ahmed Elemam)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '6 ساعات تدريبية',
        note: 'شرح متقدم لمنهجيات GitOps وإدارة كوبرنيتس في الإنتاج (12 درساً مرتباً ✔)',
        playlistId: 'PLTRDUPO2OmInz2Fo41zwnoR1IArx70Hig',
        channelUrl: 'https://youtube.com/@AhmedElemam'
      }
    ]
  }),

  // 47. Terraform
  createCourseTrack({
    id: 'terraform-iac-masterclass',
    title: 'البنية التحتية كشيفرة برمجية وأتمتة السحابة عبر Terraform (IaC)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'أتمتة بنية تحتية',
    methodologyNote: 'بناء وتعديل وإدارة الموارد السحابية تلقائياً باستخدام لغة HCL والتحكم بالبنية التحتية البرمجية.',
    rankOrder: 4,
    orderIndex: 47,
    viewsCount: 280000,
    toolsSummary: 'Terraform, HCL, Providers, State Management, Modules, IaC, Multi-Cloud',
    techStack: ['Terraform', 'IaC', 'DevOps', 'Cloud Automation', 'AWS'],
    instructors: [
      {
        id: 'inst-codographia-terraform',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '5 ساعات تدريبية',
        note: 'كورس Terraform بالعربي لشرح مفاهيم Infrastructure as Code والتطبيق العملي (11 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhBIT9-Nyt4_osatqokaN8ae',
        channelUrl: 'https://youtube.com/@Codographia'
      }
    ]
  }),

  // 48. Google Cloud
  createCourseTrack({
    id: 'google-cloud-gcp-masterclass',
    title: 'الحوسبة السحابية وخدمات البنية التحتية Google Cloud Platform (GCP)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'سحابة جوجل',
    methodologyNote: 'التعامل مع Compute Engine, Cloud Run, GKE, Cloud Storage, VPC ومفاهيم إدارة الموارد على سحابة جوجل.',
    rankOrder: 5,
    orderIndex: 48,
    viewsCount: 360000,
    toolsSummary: 'GCP, Compute Engine, GKE, Cloud Run, BigQuery, IAM, Cloud Storage',
    techStack: ['Google Cloud', 'GCP', 'Cloud Computing', 'Kubernetes', 'DevOps'],
    instructors: [
      {
        id: 'inst-anjrini-gcp',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 75,
        durationText: '26 ساعة تدريبية',
        note: 'أضخم وأشمل مسار عربي في الحوسبة السحابية لسحابة جوجل (GCP بالعربي) بمشاريع واقعية (75 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm-JJyJ5kJA02rcOXnyfqIWO',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 49. AWS
  createCourseTrack({
    id: 'aws-cloud-masterclass',
    title: 'شهادة وهندسة الحلول السحابية المعتمدة Amazon Web Services (AWS SAA)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 سحابة أمازون',
    examCode: 'AWS SAA-C03',
    methodologyNote: 'تصميم البنى التحتية عالية التوافر ومحاكاة الخدمات الأساسية EC2, S3, RDS, VPC, Lambda, IAM.',
    rankOrder: 6,
    orderIndex: 49,
    featured: true,
    trending: true,
    viewsCount: 560000,
    toolsSummary: 'AWS, EC2, S3, VPC, IAM, RDS, CloudFront, Route53, Lambda',
    techStack: ['AWS', 'Cloud Computing', 'Solutions Architect', 'Serverless'],
    instructors: [
      {
        id: 'inst-free4arab-aws',
        name: 'محمد عدي (Free4arab)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 56,
        durationText: '25 ساعة تدريبية',
        note: 'الشرح العربي المرجعي لشهادة مهندس الحلول السحابية المعتمد AWS Solutions Architect (56 درساً مرتباً ✔)',
        playlistId: 'PLLlr6jKKdyK0ZbS1lSWOLipuiXWJZhEHG',
        channelUrl: 'https://youtube.com/@Free4arab'
      },
      {
        id: 'inst-aws-riyadh-group',
        name: 'مجموعة مستخدمي أمازون بالرياض (AWS Riyadh User Group)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 18,
        durationText: '12 ساعة تدريبية',
        note: 'كورس تفاعلي شامل لشرح منهج AWS SAA-C02 مع م. عيسى أبو شريف ومعامل عملية (18 درساً مرتباً ✔)',
        playlistId: 'PLOoZRfEtk6kWSM_l9xMjDh-_MJXl03-pf',
        channelUrl: 'https://youtube.com/@AWSRiyadh'
      }
    ]
  }),

  // 50. Microservices
  createCourseTrack({
    id: 'microservices-architecture-masterclass',
    title: 'هندسة ومعمارية النظم الموزعة والخدمات المصغرة (Microservices Architecture)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'معمارية أنظمة',
    methodologyNote: 'تصميم الخدمات المستقلة، أنماط الاتصال Sync/Async، بوابات الـ API Gateway، وتحديات الاتساق والتوسع.',
    rankOrder: 7,
    orderIndex: 50,
    featured: true,
    viewsCount: 420000,
    toolsSummary: 'Microservices, API Gateway, Service Discovery, Event-Driven, Distributed Tracing',
    techStack: ['Microservices', 'System Design', 'Distributed Systems', 'Software Architecture'],
    instructors: [
      {
        id: 'inst-anjrini-microservices',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 9,
        durationText: '5 ساعات تدريبية',
        note: 'سلسلة Microservice بالعربي وشرح أنماط المعمارية الموزعة والتكامل بين الخدمات (9 دروس مرتبة ✔)',
        playlistId: 'PLZd2bo_SbAm-LKJ_x_OuOZtuwEFqbJ5B7',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      },
      {
        id: 'inst-mahmoud-youssef-arch',
        name: 'محمود يوسف (Mahmoud Youssef)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 10,
        durationText: '6 ساعات تدريبية',
        note: 'أساسيات تصميم النظم الموزعة System Design ودراسات الحالة الواقعية للأنظمة الضخمة (10 دروس مرتبة ✔)',
        playlistId: 'PLZafHDYyxnk6S9bweaJ_KYuYqituwyXjl',
        channelUrl: 'https://youtube.com/@mahyoussef'
      },
      {
        id: 'inst-arch-talks-micro',
        name: 'هندسة البرمجيات (Software Architecture Talks)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 40,
        durationText: '18 ساعة تدريبية',
        note: 'شرح معمق ومناقشات تقنية غنية حول معمارية المايكروسيرفيس بالعربي (40 درساً مرتباً ✔)',
        playlistId: 'PLgAqrVq84PDdfiDow3YVsgc1q34JD415Z',
        channelUrl: 'https://youtube.com/@SoftwareArchTalks'
      }
    ]
  }),

  // 51. أنماط التصميم وSOLID
  createCourseTrack({
    id: 'design-patterns-solid-masterclass',
    title: 'مبادئ التصميم النظيف وأنماط التصميم المعمارية (SOLID Principles & Design Patterns)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 كود نظيف',
    methodologyNote: 'كتابة شيفرات برمجية قابلة للصيانة والتوسع عبر مبادئ SOLID وأنماط Gang of Four (Creational, Structural, Behavioral).',
    rankOrder: 8,
    orderIndex: 51,
    featured: true,
    viewsCount: 510000,
    toolsSummary: 'SOLID, Factory, Singleton, Observer, Strategy, Adapter, Clean Architecture',
    techStack: ['Design Patterns', 'SOLID', 'Clean Code', 'OOP', 'Software Engineering'],
    instructors: [
      {
        id: 'inst-mohammed-reda-solid',
        name: 'محمد رضا (Mohammed Reda)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 19,
        durationText: '8 ساعات تدريبية',
        note: 'شرح تفصيلي رائع لمبادئ SOLID بالعربي مع أمثلة برمجية واقعية وإعادة هيكلة الكود (19 درساً مرتباً ✔)',
        playlistId: 'PLnqAlQ9hFYdflFSS4NigVB7aSoYPNwHTL',
        channelUrl: 'https://youtube.com/@MohammedReda'
      },
      {
        id: 'inst-omar-ahmed-solid',
        name: 'عمر أحمد (Omar Ahmed)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 6,
        durationText: '3 ساعات تدريبية',
        note: 'شرح موجز ومركّز لكل مبدأ من مبادئ SOLID باللغة العربية (6 دروس مرتبة ✔)',
        playlistId: 'PLwWuxCLlF_uevri_OpofVLXkRRFnZ7TSV',
        channelUrl: 'https://youtube.com/@OmarAhmed'
      },
      {
        id: 'inst-passionate-coders-dp',
        name: 'محمد المهدي (Passionate Coders)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 16,
        durationText: '8 ساعات تدريبية',
        note: 'شرح عميق ومتقن لأنماط التصميم المعمارية Design Patterns وتطبيقاتها الاحترافية (16 درساً مرتباً ✔)',
        playlistId: 'PLsV97AQt78NTrqUAZM562JbR3ljX19JFR',
        channelUrl: 'https://youtube.com/@PassionateCoders'
      }
    ]
  }),

  // 52. اختبار البرمجيات
  createCourseTrack({
    id: 'software-testing-qa-masterclass',
    title: 'أساسيات ومنهجيات فحص وضمان جودة البرمجيات (Software Testing & QA)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'جودة واختبار',
    methodologyNote: 'مفاهيم الاختبار اليدوي والمؤتمت، Unit Testing, Integration Testing, دورة حياة فحص البرمجيات STLC، وإعداد تقارير الأخطاء.',
    rankOrder: 9,
    orderIndex: 52,
    viewsCount: 320000,
    toolsSummary: 'Manual Testing, Automation, STLC, Test Cases, Bug Reporting, Jira, Postman',
    techStack: ['Software Testing', 'QA', 'STLC', 'Test Automation', 'Quality Assurance'],
    instructors: [
      {
        id: 'inst-tresmerge-testing',
        name: 'تريسميرج (Tresmerge)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 24,
        durationText: '10 ساعات تدريبية',
        note: 'كورس اختبار البرمجيات الكامل بالعربي وتغطية كافة مفاهيم ومراحل الـ QA (24 درساً مرتباً ✔)',
        playlistId: 'PLzNfs-3kBUJllCa8_6pLYDMnIlg6Lfvu4',
        channelUrl: 'https://youtube.com/@Tresmerge'
      }
    ]
  }),

  // 53. RegEx
  createCourseTrack({
    id: 'regex-masterclass',
    title: 'احتراف التعبيرات النمطية والتحليل النصي (Regular Expressions - RegEx)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'مهارة فائقة',
    methodologyNote: 'إتقان مطابقة النصوص، التحقق من صحة المدخلات، استخراج الأنماط، وتطبيق RegEx عبر مختلف لغات البرمجة.',
    rankOrder: 10,
    orderIndex: 53,
    viewsCount: 210000,
    toolsSummary: 'RegEx, Pattern Matching, Metacharacters, Quantifiers, Lookahead, Groups',
    techStack: ['RegEx', 'Pattern Matching', 'Parsing', 'String Manipulation'],
    instructors: [
      {
        id: 'inst-alfaham-regex',
        name: 'عبدالله الفحام (Abdallah Alfaham)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 7,
        durationText: '3 ساعات تدريبية',
        note: 'دورة مكثفة وسريعة لاحتراف التعابير النظامية Regular Expressions بالأمثلة (7 دروس مرتبة ✔)',
        playlistId: 'PLBPdtL8DZBZISjop48YSJ82FF-2uIhe-f',
        channelUrl: 'https://youtube.com/@AbdallahAlfaham'
      },
      {
        id: 'inst-hardcode-regex',
        name: 'محمود سامي (Hard-Code)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 24,
        durationText: '8 ساعات تدريبية',
        note: 'شرح مفصل وتطبيقي للتعابير النمطية خطوة بخطوة حتى الاحتراف (24 درساً مرتباً ✔)',
        playlistId: 'PLwCMLs3sjOY4aVMg7hgQGHyQBZnHgFjJk',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-naw-regex',
        name: 'تعلم مع ناو (Learn With Naw)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '8 ساعات تدريبية',
        note: 'سلسلة شاملة وتطبيقية لشرح التعابير النمطية REGEX بالعربي (25 درساً مرتباً ✔)',
        playlistId: 'PLt0HRIA9i35v2W3JFiCIeUMC4GoD9titN',
        channelUrl: 'https://youtube.com/@LearnWithNaw'
      }
    ]
  }),

  // 54. R
  createCourseTrack({
    id: 'r-programming-masterclass',
    title: 'البرمجة الإحصائية وتحليل واستكشاف البيانات بلغة R (R Programming)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'إحصاء وتحليل بيانات',
    methodologyNote: 'المعالجة الإحصائية، الرسوم البيانية المتقدمة، وتحليل مجموعات البيانات العلمية والتجريبية بلغة R.',
    rankOrder: 11,
    orderIndex: 54,
    viewsCount: 250000,
    toolsSummary: 'R, RStudio, ggplot2, Data Wrangling, Statistical Analysis, Data Frames',
    techStack: ['R', 'RStudio', 'Statistics', 'Data Science', 'Data Analysis'],
    instructors: [
      {
        id: 'inst-desouki-r',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 20,
        durationText: '10 ساعات تدريبية',
        note: 'كورس لغة R للمبتدئين بالعربي مع التطبيق الإحصائي وتحليل البيانات (20 درساً مرتباً ✔)',
        playlistId: 'PL1DUmTEdeA6LKTMW3wrlT3GiFMCL_r_Sn',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      }
    ]
  }),

  // ==========================================
  // سادساً وسابعاً وثامناً: مسارات القطاعات الأكاديمية الأخرى (6 مسارات)
  // ==========================================

  // 55. قطاع الذكاء الاصطناعي وعلم البيانات - Machine Learning
  createCourseTrack({
    id: 'machine-learning-data-science',
    title: 'الذكاء الاصطناعي وعلم البيانات الشامل Machine Learning & Data Science',
    domainId: 'ai-data-science',
    domainTitle: 'الذكاء الاصطناعي وعلم البيانات',
    badge: 'المرتبة #1',
    methodologyNote: 'فهم الرياضيات الأساسية (الجبر الخطي والتفاضل) وتطبيق خوارزميات التعلم على مجموعات بيانات حقيقية.',
    rankOrder: 1,
    orderIndex: 55,
    featured: true,
    viewsCount: 540000,
    toolsSummary: 'Python, NumPy, Pandas, Scikit-Learn, Matplotlib, Regression',
    techStack: ['Python', 'Machine Learning', 'Data Science', 'Pandas'],
    instructors: [
      {
        id: 'inst-hesham-asem-ml',
        name: 'د. هشام عاصم',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 52,
        durationText: '30 ساعة',
        note: 'أكبر موسوعة عربية عملية لشرح وتطبيق خوارزميات تعلم الآلة الكلاسيكية والحديثة',
        playlistId: 'PLml-hesham',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في الذكاء الاصطناعي والفرق بين ML و Deep Learning', duration: '24:10' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'معالجة وتحليل البيانات باستخدام Pandas و NumPy المتقدمة', duration: '32:00' }
        ]
      },
      {
        id: 'inst-andrew-ng',
        name: 'Andrew Ng (DeepLearning.AI)',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 38,
        durationText: '24 ساعة',
        note: 'دورة ستانفورد الرائدة التي دربت ملايين المتخصصين في الذكاء الاصطناعي حول العالم',
        playlistId: 'PLml-andrewng',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Supervised vs Unsupervised Learning Explained', duration: '20:45' }
        ]
      }
    ]
  }),

  // 56. قطاع الذكاء الاصطناعي وعلم البيانات - LLMs & Generative AI
  createCourseTrack({
    id: 'generative-ai-llm-engineering',
    title: 'هندسة النماذج اللغوية الكبيرة والذكاء الاصطناعي التوليدي LLMs & RAG',
    domainId: 'ai-data-science',
    domainTitle: 'الذكاء الاصطناعي وعلم البيانات',
    badge: 'جديد 2026',
    methodologyNote: 'بناء تطبيقات ذكية باستخدام LangChain و LlamaIndex وتقنيات استرجاع البيانات الموجه RAG.',
    rankOrder: 2,
    orderIndex: 56,
    viewsCount: 380000,
    toolsSummary: 'LangChain, LlamaIndex, OpenAI, HuggingFace, Vector DBs, RAG',
    techStack: ['Generative AI', 'LLMs', 'RAG', 'LangChain'],
    instructors: [
      {
        id: 'inst-hisham-dahshan',
        name: 'د. هشام دهشان',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '14 ساعة',
        note: 'دورة متقدمة تواكب أحدث تقنيات بناء الوكلاء الأذكياء وقواعد البيانات الشعاعية',
        playlistId: 'PLgenai-dahshan',
        lessons: [
          { index: 1, videoId: 'mvZHDpCHphk', title: 'معمارية الـ Transformers وهندسة الأوامر المتقدمة Prompt Engineering', duration: '28:30' }
        ]
      },
      {
        id: 'inst-krish-naik',
        name: 'Krish Naik',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 34,
        durationText: '18 ساعة',
        note: 'مشاريع عملية لنشر تطبيقات الذكاء الاصطناعي التوليدي وقواعد البيانات المتجهة',
        playlistId: 'PLgenai-krish',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'Complete GenAI & LangChain Course with End to End Projects', duration: '42:15' }
        ]
      }
    ]
  }),

  // 57. قطاع الشبكات والأمن السيبراني - Cisco CCNA
  createCourseTrack({
    id: 'cisco-ccna-200-301',
    title: 'شهادة سيسكو الرسمية لإدارة الشبكات CCNA 200-301',
    domainId: 'networking-cybersecurity',
    domainTitle: 'الشبكات والأمن السيبراني',
    badge: 'المرتبة #1',
    examCode: 'CCNA 200-301',
    methodologyNote: 'يُنصح بدراسة المسار الأساسي وتطبيق تمارين Packet Tracer قبل دخول الامتحان الدولي.',
    rankOrder: 1,
    orderIndex: 57,
    featured: true,
    viewsCount: 385000,
    toolsSummary: 'Cisco IOS, Packet Tracer, Wireshark, Subnetting',
    techStack: ['Cisco', 'Packet Tracer', 'OSPF', 'IPv6', 'VLAN'],
    instructors: [
      {
        id: 'inst-ahmed-hassan',
        name: 'م. أحمد حسن',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 42,
        durationText: '32 ساعة',
        note: 'شرح أكاديمي شامل ومحدث لمنهج سيسكو الجديد مع محاكاة المعامل والتطبيق العملي',
        playlistId: 'PLrXX6HqGk5nNxxcc3d4Lg-8hV901',
        channelUrl: 'https://youtube.com/@ahmed-hassan-networks',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في أساسيات الشبكات والنموذج المرجعي OSI', duration: '22:15' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'بروتوكولات التوجيه وبناء عناوين IPv4 و IPv6', duration: '35:40' }
        ]
      },
      {
        id: 'inst-jeremy-it-lab',
        name: "Jeremy's IT Lab",
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 60,
        durationText: '40 ساعة',
        note: 'أفضل مسار تطبيقي دولي مع بطاقات استذكار Anki ومعامل Packet Tracer جاهزة',
        playlistId: 'PLjeremy-ccna',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Free CCNA 200-301 Complete Course - Network Fundamentals', duration: '28:15' }
        ]
      }
    ]
  }),

  // 58. قطاع الشبكات والأمن السيبراني - CompTIA Security+
  createCourseTrack({
    id: 'comptia-security-plus',
    title: 'أساسيات واحتراف الأمن السيبراني واختبار الاختراق CompTIA Security+',
    domainId: 'networking-cybersecurity',
    domainTitle: 'الشبكات والأمن السيبراني',
    badge: 'شهادة أمنية دولية',
    examCode: 'SY0-701',
    methodologyNote: 'تغطية شاملة لمبادئ Zero Trust والتشفير والدفاع عن الشبكات ضد الهجمات المتقدمة.',
    rankOrder: 2,
    orderIndex: 58,
    viewsCount: 310000,
    toolsSummary: 'Kali Linux, Wireshark, Metasploit, Cryptography, Nmap, SIEM',
    techStack: ['Cybersecurity', 'Security+', 'Kali Linux', 'Penetration Testing'],
    instructors: [
      {
        id: 'inst-ibrahim-hijazi',
        name: 'م. إبراهيم حجازي',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 45,
        durationText: '28 ساعة',
        note: 'شرح تطبيقي باللغة العربية مع محاكاة بيئات الاختراق الأخلاقي والتأهب لشهادة Security+',
        playlistId: 'PLsecplus-hijazi',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'مقدمة في التهديدات السيبرانية وأنواع الهجمات الإلكترونية', duration: '26:50' },
          { index: 2, videoId: 'mvZHDpCHphk', title: 'معمارية الأمان المؤسسي وأنظمة كشف التسلل IDS/IPS', duration: '33:10' }
        ]
      },
      {
        id: 'inst-prof-messer',
        name: 'Professor Messer',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 110,
        durationText: '35 ساعة',
        note: 'المسار التدريبي الأكثر ثقة واعتماداً حول العالم لاجتياز اختبار CompTIA Security+ SY0-701',
        playlistId: 'PLprof-messer-secplus',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'CompTIA SY0-701 Security+ Training Course Introduction', duration: '12:30' }
        ]
      }
    ]
  }),

  // 59. قطاع الأعمال واللغات - إدارة المنتجات
  createCourseTrack({
    id: 'tech-product-management-agile',
    title: 'إدارة المنتجات التقنية وقيادة الفرق الرقمية Agile & Product Management',
    domainId: 'business-languages',
    domainTitle: 'الأعمال واللغات',
    badge: 'المرتبة #1',
    examCode: 'PSPO I',
    methodologyNote: 'إتقان دورة حياة المنتج من فكرة العميل حتى الإطلاق وإدارة مؤشرات الأداء OKRs & KPIs.',
    rankOrder: 1,
    orderIndex: 59,
    viewsCount: 195000,
    toolsSummary: 'Jira, Scrum, OKRs, Product Discovery, User Research, Roadmaps',
    techStack: ['Product Management', 'Agile', 'Scrum', 'Jira'],
    instructors: [
      {
        id: 'inst-ahmed-essam',
        name: 'أحمد عصام',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '12 ساعة',
        note: 'دليل عملي واقعي لبناء وإطلاق المنتجات الرقمية والتنسيق بين فرق البرمجة والتسويق',
        playlistId: 'PLpm-ahmed',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في إدارة المنتجات الرقمية والفرق بين PM و PO', duration: '22:15' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'منهجية أجايل وإطار عمل Scrum وإدارة الـ Backlog', duration: '26:40' }
        ]
      },
      {
        id: 'inst-google-pm',
        name: 'Google Career Certificates',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 30,
        durationText: '20 ساعة',
        note: 'الشهادة المهنية الرسمية من جوجل لإدارة المشاريع والمنتجات التقنية الحديثة',
        playlistId: 'PLgoogle-pm',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Google Project Management Professional Certificate Overview', duration: '18:10' }
        ]
      }
    ]
  }),

  // 60. قطاع الأعمال واللغات - إنجليزي المطورين
  createCourseTrack({
    id: 'english-for-software-engineers',
    title: 'اللغة الإنجليزية المهنية للمطورين والمبرمجين English for Tech & Remote Work',
    domainId: 'business-languages',
    domainTitle: 'الأعمال واللغات',
    badge: 'مسار مهني',
    methodologyNote: 'التدريب على المقابلات التقنية بالإنجليزية، كتابة الإيميلات المهنية وتوثيق الأكواد البرمجية.',
    rankOrder: 2,
    orderIndex: 60,
    viewsCount: 220000,
    toolsSummary: 'Tech Interviews, Remote Communication, PR Reviews, Documentation',
    techStack: ['English', 'Tech Communication', 'Interviews'],
    instructors: [
      {
        id: 'inst-omar-abdelrahim',
        name: 'عمر عبد الرحيم',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 20,
        durationText: '10 ساعات',
        note: 'شرح مبسط ومركّز للمصطلحات الإنجليزية الأكثر استخداماً في المقابلات والعمل عن بعد',
        playlistId: 'PLenglish-omar',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'المصطلحات الإنجليزية الأكثر أهمية في بيئات العمل التقنية', duration: '18:30' }
        ]
      },
      {
        id: 'inst-rachels-english',
        name: "Rachel's English",
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 25,
        durationText: '12 ساعة',
        note: 'نطق سليم واحترافي للمصطلحات والعبارات أثناء الاجتماعات وعروض العمل التقديمية',
        playlistId: 'PLenglish-rachel',
        lessons: [
          { index: 1, videoId: 'mvZHDpCHphk', title: 'American English Pronunciation for Professionals and Tech', duration: '22:00' }
        ]
      }
    ]
  })
];
`;

const finalFileContent = headerPart + stage5TracksCode + '`;\n\nfs.writeFileSync(COURSES_FILE, code, \'utf8\');\nconsole.log(\'Successfully wrote courses.js. Total size:\', fs.statSync(COURSES_FILE).size);\n';

fs.writeFileSync(STAGE4_BUILD_FILE, finalFileContent, 'utf8');
console.log('Updated scripts/build-stage4-courses.mjs with Stage 5 tracks.');
