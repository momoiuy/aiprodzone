import { ExternalLink } from 'lucide-react';
import { CURATED_AI_TOOLS } from '../data/tools';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

// Props: { onSelectCategory: (cat: string) => void }
export default function Tools({ onSelectCategory }) {
  return (
    <div className="space-y-6 animate-smooth">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Chip tone="accent">دليل أدوات AIProdZone الموصى بها</Chip>
          <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
            مقارنة أفضل أدوات الذكاء الاصطناعي والبرمجة وصناعة الفيديو
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={() => onSelectCategory('أدوات')}
          className="px-4 py-2.5 self-start sm:self-auto"
        >
          عرض شروحات الفيديو للأدوات
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CURATED_AI_TOOLS.map((t) => (
          <Card
            key={t.id}
            interactive
            className="p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* Chip #1 (Neutral): Category */}
                <Chip tone="neutral">{t.category}</Chip>
                {/* Chip #2 (Accent): Primary Rating Metric */}
                <Chip tone="accent">★ {t.rating} / 10</Chip>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-text-heading" dir="ltr">
                {t.name}
              </h3>
              <p className="text-xs leading-relaxed text-text-muted">{t.description}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-bold text-text-muted">{t.pricing}</span>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold inline-flex items-center gap-1 text-text-heading hover:text-accent transition-colors"
              >
                <span>زيارة الموقع الرسمي</span>
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
