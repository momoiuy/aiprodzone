import { X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

// Props: { isOpen: boolean, onClose: () => void }
export default function BrandModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-smooth"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-extrabold text-text-heading">هوية منصة AIProdZone الرسمية</h3>
          <Button variant="ghost" onClick={onClose} className="p-1.5">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="rounded-xl overflow-hidden border border-border bg-surface-2">
          <img
            src="/brand-banner.png"
            alt="AIProdZone Official Brand Banner"
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-xs leading-relaxed text-text-muted">
          منصة عربية مجانية بالكامل متخصصة في ترتيب وتنقيح أعمق شروحات يوتيوب والكتب الإلكترونية في مجالات البرمجة، الذكاء الاصطناعي، صناعة الفيديو، والربح من الإنترنت (`aiprodzone.com`).
        </p>
      </Card>
    </div>
  );
}
