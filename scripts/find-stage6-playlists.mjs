import { searchYouTubePlaylists, fetchPlaylistDetails } from '../src/lib/youtube-scraper.js';

const searchQueries = [
  // Sector 6: AI & Data Science
  // 1. Machine Learning
  { track: 'Machine Learning', inst: 'Hesham Asem', query: 'هشام عاصم الدورة الكاملة لتعلم الآلة' },
  { track: 'Machine Learning', inst: 'Andrew Ng', query: 'Andrew Ng Machine Learning Specialization Stanford' },

  // 2. Deep Learning
  { track: 'Deep Learning', inst: 'Hesham Asem', query: 'هشام عاصم التعلم العميق Deep Learning' },
  { track: 'Deep Learning', inst: '3Blue1Brown', query: '3Blue1Brown Neural Networks Deep Learning' },

  // 3. Data Science & Analysis
  { track: 'Data Science', inst: 'Hesham Asem', query: 'هشام عاصم Data Science علم البيانات' },
  { track: 'Data Science', inst: 'محمد الدسوقي', query: 'محمد الدسوقي Data Analysis تحليل البيانات' },

  // 4. Generative AI & LLMs
  { track: 'Generative AI', inst: 'Hisham Dahshan', query: 'هشام دهشان Generative AI ذكاء اصطناعي توليدي' },
  { track: 'Generative AI', inst: 'FreeCodeCamp', query: 'FreeCodeCamp Generative AI LLM Large Language Models' },

  // 5. Computer Vision
  { track: 'Computer Vision', inst: 'Hesham Asem', query: 'هشام عاصم Computer Vision الرؤية الحاسوبية OpenCV' },
  { track: 'Computer Vision', inst: 'Murtaza Workshop', query: 'Murtaza Workshop Computer Vision OpenCV' },

  // 6. NLP
  { track: 'NLP', inst: 'Hesham Asem', query: 'هشام عاصم NLP معالجة اللغات الطبيعية' },

  // 7. NumPy & Pandas (Data Stack)
  { track: 'Data Stack', inst: 'Elzero', query: 'Elzero Web School Python Data Analysis NumPy Pandas' },
  { track: 'Data Stack', inst: 'Adel Nasim', query: 'Adel Nasim Data Analysis NumPy Pandas' },

  // Sector 7: Networking & Cybersecurity
  // 1. CCNA 200-301
  { track: 'CCNA', inst: 'Ahmed Hassan', query: 'أحمد حسن CCNA 200-301 Free4arab' },
  { track: 'CCNA', inst: 'Jeremys IT Lab', query: 'Jeremys IT Lab Free CCNA 200-301 Complete Course' },

  // 2. CompTIA Security+
  { track: 'Security+', inst: 'Ibrahim Hegazy', query: 'إبراهيم حجازي Security+ أمن المعلومات' },
  { track: 'Security+', inst: 'Professor Messer', query: 'Professor Messer CompTIA Security+ SY0-701 Training Course' },

  // 3. CompTIA Network+
  { track: 'Network+', inst: 'Ahmed Nabil', query: 'أحمد نبيل Network+ Free4arab نيتورك بلس' },
  { track: 'Network+', inst: 'Professor Messer', query: 'Professor Messer CompTIA Network+ Training Course' },

  // 4. Ethical Hacking & CEH
  { track: 'Ethical Hacking', inst: 'Saif Mokharza', query: 'سيف مخارزة Ethical Hacking الهاكر الأخلاقي' },
  { track: 'Ethical Hacking', inst: 'NetworkChuck', query: 'NetworkChuck Ethical Hacking coffee' },

  // 5. SOC & Cyber Defense
  { track: 'SOC', inst: 'Cyber Security Arabic', query: 'SOC Analyst بالعربي Cyber Security مركز العمليات الأمنية' },

  // 6. Web Application Security
  { track: 'Web Security', inst: 'Ibrahim Hegazy', query: 'إبراهيم حجازي ثغرات الويب OWASP Web Security' },
  { track: 'Web Security', inst: 'Rana Khalil', query: 'Rana Khalil Web Security Academy PortSwigger' },

  // Sector 8: Business & Languages
  // 1. Product Management
  { track: 'Product Management', inst: 'Ahmed Essam', query: 'أحمد عصام إدارة المنتجات Product Management' },
  { track: 'Product Management', inst: 'Google Certificates', query: 'Google Project Management Professional Certificate' },

  // 2. Agile & Scrum
  { track: 'Agile & Scrum', inst: 'Amr Hassouna', query: 'عمرو حسونة Agile Scrum أجايل وسكروم' },
  { track: 'Agile & Scrum', inst: 'Ahmed Essam', query: 'أحمد عصام Agile Scrum' },

  // 3. Freelancing for Devs
  { track: 'Freelancing', inst: 'Nour Homsi', query: 'نور حمصي العمل الحر للمطورين والمصممين Freelance' },
  { track: 'Freelancing', inst: 'Ghareeb Elshikh', query: 'غريب الشيخ العمل الحر للمبرمجين' },

  // 4. English for Tech
  { track: 'English for Tech', inst: 'Omar Abdelrahim', query: 'عمر عبد الرحيم إنجليزي للمقابلات والعمل' },
  { track: 'English for Tech', inst: 'Rachels English', query: 'Rachels English Business English Pronunciation' },

  // 5. Tech Entrepreneurship
  { track: 'Entrepreneurship', inst: 'Wael Fakharany', query: 'وائل فخراني ريادة الأعمال والشركات الناشئة' },
  { track: 'Entrepreneurship', inst: 'Y Combinator', query: 'Y Combinator Startup School How to Start a Startup' },

  // 6. Digital Marketing for Tech
  { track: 'Digital Marketing', inst: 'Hossam Hassan', query: 'حسام حسان التسويق الرقمي Digital Marketing' },
  { track: 'Digital Marketing', inst: 'Google Digital Garage', query: 'Google Digital Garage أساسيات التسويق الرقمي' }
];

async function main() {
  console.log(`Starting search for ${searchQueries.length} instructor playlists...`);
  const results = [];

  for (let i = 0; i < searchQueries.length; i++) {
    const item = searchQueries[i];
    try {
      const hits = await searchYouTubePlaylists(item.query, 1);
      if (hits && hits.length > 0) {
        const hit = hits[0];
        console.log(`[${i + 1}/${searchQueries.length}] ✓ ${item.track} (${item.inst}): ${hit.playlistId} - "${hit.title}" (${hit.channelTitle})`);
        results.push({
          track: item.track,
          inst: item.inst,
          query: item.query,
          playlistId: hit.playlistId,
          title: hit.title,
          channel: hit.channelTitle,
          thumbnail: hit.thumbnail
        });
      } else {
        console.log(`[${i + 1}/${searchQueries.length}] ❌ No hits for: ${item.query}`);
      }
    } catch (err) {
      console.log(`[${i + 1}/${searchQueries.length}] ⚠️ Error for: ${item.query} - ${err.message}`);
    }
    // Small delay to be gentle
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('\n--- SUMMARY RESULTS JSON ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
