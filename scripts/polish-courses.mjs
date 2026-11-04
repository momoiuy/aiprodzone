import fs from 'node:fs';
import path from 'node:path';

const coursesFile = path.resolve('src/data/courses.js');
let code = fs.readFileSync(coursesFile, 'utf-8');

// 1. Update Hesham Asem name to include Arabic and English
code = code.replace(/name: 'Hesham Asem'/g, "name: 'د. هشام عاصم (Hesham Asem)'");
code = code.replace(/name: 'Ahmed Hassan'/g, "name: 'م. أحمد حسن (Ahmed Hassan)'");
code = code.replace(/name: 'Ahmed Nabil'/g, "name: 'م. أحمد نبيل (Ahmed Nabil)'");

// 2. Fix agile-scrum-masterclass primary instructor
code = code.replace(
  /id: 'agile-scrum-masterclass'[\s\S]+?instructors: \[\s+\{\s+id: '([^']+)',\s+name: '([^']+)',\s+role: 'بديل معتمد'/,
  (match) => match.replace("role: 'بديل معتمد'", "role: 'أساسي'")
);

// 3. Fix freelancing-remote-work-tech primary instructor
code = code.replace(
  /id: 'freelancing-remote-work-tech'[\s\S]+?instructors: \[\s+\{\s+id: '([^']+)',\s+name: '([^']+)',\s+role: 'بديل معتمد'/,
  (match) => match.replace("role: 'بديل معتمد'", "role: 'أساسي'")
);

// 4. Update cisco-ccna-200-301 with examCode & Packet Tracer note
code = code.replace(
  /id: 'cisco-ccna-200-301',\s+title: '([^']+)',\s+domainId: 'networking-cybersecurity',\s+domainTitle: 'الشبكات والأمن السيبراني',\s+badge: 'شهادة دولية',\s+methodologyNote: '([^']+)'/,
  "id: 'cisco-ccna-200-301',\n    title: 'شهادة سيسكو الرسمية لإدارة الشبكات Cisco CCNA 200-301',\n    domainId: 'networking-cybersecurity',\n    domainTitle: 'الشبكات والأمن السيبراني',\n    badge: 'شهادة دولية',\n    examCode: 'CCNA 200-301',\n    methodologyNote: 'التطبيق العملي على برامج المحاكاة Cisco Packet Tracer و GNS3 وبناء الشبكات الافتراضية.'"
);

// 5. Update comptia-security-plus with examCode & Zero Trust note
code = code.replace(
  /id: 'comptia-security-plus',\s+title: '([^']+)',\s+domainId: 'networking-cybersecurity',\s+domainTitle: 'الشبكات والأمن السيبراني',\s+badge: 'شهادة دولية',\s+methodologyNote: '([^']+)'/,
  "id: 'comptia-security-plus',\n    title: 'أساسيات واحتراف الأمن السيبراني CompTIA Security+',\n    domainId: 'networking-cybersecurity',\n    domainTitle: 'الشبكات والأمن السيبراني',\n    badge: 'شهادة دولية',\n    examCode: 'SY0-701',\n    methodologyNote: 'تغطية معايير Zero Trust، إدارة الثغرات، والتشفير واختبار الاختراق الدفاعي وفق معايير CompTIA.'"
);

// 6. Update python-data-stack-numpy-pandas title & techStack
code = code.replace(
  /id: 'python-data-stack-numpy-pandas',\s+title: 'مكتبات بايثون لتحليل البيانات والذكاء الاصطناعي NumPy & Pandas'/,
  "id: 'python-data-stack-numpy-pandas',\n    title: 'مكتبات بايثون لتحليل البيانات والذكاء الاصطناعي Python for AI (NumPy & Pandas)'"
);

fs.writeFileSync(coursesFile, code, 'utf-8');
console.log('Successfully polished courses.js!');
