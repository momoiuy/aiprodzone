// قائمة الأقسام والمجالات الأكاديمية الرئيسية الثمانية (8 Academic Domains)
export const ACADEMIC_DOMAINS = [
  {
    orderIndex: 1,
    id: 'web-programming',
    name: 'الويب والبرمجة',
    shortName: 'الويب والبرمجة',
    description: 'تطوير تطبيقات ومواقع الويب، الواجهات الأمامية والخلفية وأحدث التقنيات وأطر العمل.',
    icon: 'Code2',
    badge: 'المجال #1'
  },
  {
    orderIndex: 2,
    id: 'languages-apps',
    name: 'لغات وتطبيقات وألعاب',
    shortName: 'لغات وتطبيقات وألعاب',
    description: 'لغات البرمجة الأساسية والحديثة، تطوير تطبيقات الموبايل وصناعة الألعاب الإلكترونية.',
    icon: 'Smartphone',
    badge: 'المجال #2'
  },
  {
    orderIndex: 3,
    id: 'computer-science',
    name: 'علوم الحاسوب',
    shortName: 'علوم الحاسوب',
    description: 'الخوارزميات، هياكل البيانات، هندسة البرمجيات والمعمارية والأسس النظرية للحوسبة.',
    icon: 'Cpu',
    badge: 'المجال #3'
  },
  {
    orderIndex: 4,
    id: 'databases-backend',
    name: 'قواعد البيانات والخلفية',
    shortName: 'قواعد البيانات والخلفية',
    description: 'معمارية الأنظمة الخلفية، قواعد البيانات العلائقية وغير العلائقية وهندسة واجهات API.',
    icon: 'Database',
    badge: 'المجال #4'
  },
  {
    orderIndex: 5,
    id: 'devops-cloud',
    name: 'DevOps والسحابة والهندسة',
    shortName: 'DevOps والسحابة',
    description: 'الحوسبة السحابية، أتمتة العمليات، الحاويات وخطوط النشر المستمر والبنى التحتية ككود.',
    icon: 'Cloud',
    badge: 'المجال #5'
  },
  {
    orderIndex: 6,
    id: 'ai-data-science',
    name: 'الذكاء الاصطناعي وعلم البيانات',
    shortName: 'الذكاء الاصطناعي والبيانات',
    description: 'تعلم الآلة، التعلم العميق، تحليل البيانات والأنظمة الذكية والنماذج التوليدية.',
    icon: 'Brain',
    badge: 'المجال #6'
  },
  {
    orderIndex: 7,
    id: 'networking-cybersecurity',
    name: 'الشبكات والأمن السيبراني',
    shortName: 'الشبكات والأمن السيبراني',
    description: 'هندسة الشبكات والشهادات الاحترافية الدولية، أمن المعلومات واختبار الاختراق الدفاعي والهجومي.',
    icon: 'Shield',
    badge: 'المجال #7'
  },
  {
    orderIndex: 8,
    id: 'business-languages',
    name: 'الأعمال واللغات',
    shortName: 'الأعمال واللغات',
    description: 'إدارة المنتجات التقنية، ريادة الأعمال، اللغات الحية ومهارات التواصل والعمل الحر.',
    icon: 'Briefcase',
    badge: 'المجال #8'
  }
];

// للتوافق التام مع كافة مكونات المنصة ولوحة التحكم
export const SEED_CATEGORIES = ACADEMIC_DOMAINS;
export const CATEGORY_NAMES = SEED_CATEGORIES.map((c) => c.name);
