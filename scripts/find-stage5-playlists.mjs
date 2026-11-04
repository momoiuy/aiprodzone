import { searchYouTubePlaylists, fetchPlaylistDetails } from '../src/lib/youtube-scraper.js';

const searchQueries = [
  // Sector 3: Computer Science
  // 1. الخوارزميات
  { track: 'Algorithms', inst: 'Hard-Code', query: 'محمود سامي Hard-Code Algorithms الخوارزميات' },
  { track: 'Algorithms', inst: 'Adel Nasim', query: 'Adel Nasim Algorithms الخوارزميات' },
  { track: 'Algorithms', inst: 'محمد الدسوقي', query: 'محمد الدسوقي Algorithms الخوارزميات' },

  // 2. هياكل البيانات
  { track: 'Data Structures', inst: 'Adel Nasim', query: 'Adel Nasim Data Structures هياكل البيانات' },
  { track: 'Data Structures', inst: 'Hard-Code', query: 'محمود سامي Hard-Code Data Structure هياكل البيانات' },
  { track: 'Data Structures', inst: 'Nehal Elsamoly', query: 'نهال الصامولي Data Structures هياكل البيانات' },

  // 3. Assembly
  { track: 'Assembly', inst: 'Ahmed Sallam', query: 'Ahmed Sallam Assembly أسمبلي' },
  { track: 'Assembly', inst: 'Sherif Ezzat', query: 'Sherif Ezzat Assembly شريف عزت' },

  // 4. معمارية الحاسوب
  { track: 'Computer Architecture', inst: 'Ahmed Sallam', query: 'Ahmed Sallam Computer Architecture معمارية الحاسوب' },

  // 5. أنظمة التشغيل
  { track: 'Operating Systems', inst: 'Ahmed Sallam', query: 'Ahmed Sallam Operating Systems أنظمة التشغيل' },
  { track: 'Operating Systems', inst: 'Ahmed Hagag', query: 'Ahmed Hagag Operating Systems أنظمة التشغيل' },
  { track: 'Operating Systems', inst: 'Mohamed Alsayed', query: 'Mohamed Alsayed Operating Systems أنظمة التشغيل' },

  // 6. Linux
  { track: 'Linux', inst: 'anahr', query: 'anahr linux أنس النهر لينكس' },

  // 7. Prolog
  { track: 'Prolog', inst: 'Ahmed Sallam', query: 'Ahmed Sallam Prolog برمجة منطقية' },

  // 8. CS50 بالعربي
  { track: 'CS50', inst: 'KMR Script', query: 'KMR Script CS50 بالعربي' },
  { track: 'CS50', inst: 'Coders Camp', query: 'Coders Camp رشا عابدين CS50' },
  { track: 'CS50', inst: 'Abdelrahman Gamal', query: 'Abdelrahman Gamal CS50 بالعربي' },

  // Sector 4: Databases & Backend
  // 1. قواعد البيانات (نظري)
  { track: 'Database Concepts', inst: 'محمد الدسوقي', query: 'محمد الدسوقي Database Concepts قواعد البيانات' },
  { track: 'Database Concepts', inst: 'KMR Script', query: 'KMR Script Database قواعد البيانات' },

  // 2. SQL
  { track: 'SQL', inst: 'Elzero', query: 'Elzero Web School MySQL SQL' },
  { track: 'SQL', inst: 'محمد الدسوقي', query: 'محمد الدسوقي SQL Server' },
  { track: 'SQL', inst: 'TheNewBaghdad', query: 'TheNewBaghdad SQL حسين الربيعي' },

  // 3. MongoDB
  { track: 'MongoDB', inst: 'Algorithm Academy', query: 'Algorithm Academy MongoDB أكاديمية الخوارزمي' },
  { track: 'MongoDB', inst: 'Emam Academy', query: 'Emam Academy MongoDB إمام أكاديمي' },
  { track: 'MongoDB', inst: 'TheNewBaghdad', query: 'TheNewBaghdad MongoDB حسين الربيعي' },

  // 4. Redis
  { track: 'Redis', inst: 'Ismail Anjrini', query: 'Ismail Anjrini Redis إسماعيل عنجريني' },

  // 5. Elastic
  { track: 'Elastic', inst: 'Ismail Anjrini', query: 'Ismail Anjrini Elasticsearch إسماعيل عنجريني' },

  // 6. RabbitMQ
  { track: 'RabbitMQ', inst: 'Ismail Anjrini', query: 'Ismail Anjrini RabbitMQ إسماعيل عنجريني' },

  // Sector 5: DevOps, Cloud & Engineering
  // 1. Git
  { track: 'Git', inst: 'Elzero', query: 'Elzero Web School Git and GitHub' },
  { track: 'Git', inst: 'Khalid Elshafie', query: 'Khalid Elshafie Git GitHub خالد الشافعي' },
  { track: 'Git', inst: 'أكاديمية ترميز', query: 'أكاديمية ترميز Git GitHub' },

  // 2. Docker
  { track: 'Docker', inst: 'Codographia', query: 'Codographia Docker دوكر كودوغرافيا' },
  { track: 'Docker', inst: 'Tresmerge', query: 'Tresmerge Docker دوكر تريسميرج' },
  { track: 'Docker', inst: 'Ahmed Sami', query: 'Ahmed Sami Docker أحمد سامي دوكر' },

  // 3. Kubernetes
  { track: 'Kubernetes', inst: 'Codographia', query: 'Codographia Kubernetes كوبرنيتس' },
  { track: 'Kubernetes', inst: 'Ahmed Elemam', query: 'Ahmed Elemam Kubernetes أحمد الإمام كوبرنيتس' },

  // 4. Terraform
  { track: 'Terraform', inst: 'Codographia', query: 'Codographia Terraform كودوغرافيا' },

  // 5. Google Cloud
  { track: 'Google Cloud', inst: 'Ismail Anjrini', query: 'Ismail Anjrini Google Cloud إسماعيل عنجريني' },

  // 6. AWS
  { track: 'AWS', inst: 'Free4arab', query: 'Free4arab AWS محمد عدي' },
  { track: 'AWS', inst: 'AWS Riyadh User Group', query: 'AWS Riyadh User Group' },

  // 7. Microservices
  { track: 'Microservices', inst: 'Ismail Anjrini', query: 'Ismail Anjrini Microservices إسماعيل عنجريني' },
  { track: 'Microservices', inst: 'Mahmoud Youssef', query: 'Mahmoud Youssef Microservices محمود يوسف' },
  { track: 'Microservices', inst: 'Software Architecture Talks', query: 'Software Architecture Talks Microservices' },

  // 8. Design Patterns & SOLID
  { track: 'Design Patterns & SOLID', inst: 'Mohammed Reda', query: 'Mohammed Reda Design Patterns محمد رضا' },
  { track: 'Design Patterns & SOLID', inst: 'Omar Ahmed', query: 'Omar Ahmed SOLID Principles عمر أحمد' },
  { track: 'Design Patterns & SOLID', inst: 'Passionate Coders', query: 'Passionate Coders Design Patterns' },

  // 9. Software Testing
  { track: 'Software Testing', inst: 'Tresmerge', query: 'Tresmerge Software Testing اختبار البرمجيات' },

  // 10. RegEx
  { track: 'RegEx', inst: 'Abdallah Alfaham', query: 'Abdallah Alfaham Regular Expressions عبدالله الفحام' },
  { track: 'RegEx', inst: 'Hard-Code', query: 'محمود سامي Hard-Code Regular Expressions RegEx' },
  { track: 'RegEx', inst: 'Learn With Naw', query: 'Learn With Naw RegEx Regular Expressions' },

  // 11. R
  { track: 'R', inst: 'محمد الدسوقي', query: 'محمد الدسوقي لغة R البرمجة الإحصائية' }
];

async function run() {
  console.log(`Starting search for ${searchQueries.length} items...`);
  const found = [];

  for (let i = 0; i < searchQueries.length; i++) {
    const item = searchQueries[i];
    console.log(`[${i + 1}/${searchQueries.length}] Searching: ${item.track} | ${item.inst} (${item.query})...`);
    try {
      const results = await searchYouTubePlaylists(item.query, { limit: 3 });
      if (results.length > 0) {
        console.log(`   Found: ${results[0].playlistId} | ${results[0].title} | Channel: ${results[0].channelTitle}`);
        found.push({
          track: item.track,
          inst: item.inst,
          query: item.query,
          firstResult: results[0],
          allResults: results
        });
      } else {
        console.log(`   ❌ No results found!`);
        found.push({
          track: item.track,
          inst: item.inst,
          query: item.query,
          firstResult: null,
          allResults: []
        });
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  import('node:fs').then(fs => {
    fs.writeFileSync('scripts/stage5-search-results.json', JSON.stringify(found, null, 2), 'utf8');
    console.log('Saved to scripts/stage5-search-results.json');
  });
}

run();
