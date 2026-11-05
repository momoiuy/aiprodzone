import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { UserCheck, Home } from 'lucide-react';
import { LibraryProvider } from '../../src/context/LibraryContext';
import StandaloneHeader from '../../src/components/StandaloneHeader';
import Footer from '../../src/components/Footer';
import StudentProfileHub from '../../src/components/StudentProfileHub';

export const dynamic = 'force-static';

const siteUrl = 'https://aiprodzone.com';
const canonicalUrl = `${siteUrl}/profile`;

export const metadata: Metadata = {
  title: 'حسابي ومحفظتي التعليمية | AIProdZone',
  description:
    'محفظة وحساب الطالب المستقل: متابعة الدروس المكتملة، استئناف المسارات قيد الدراسة، وإدارة النسخ الاحتياطي لمحفظتك المحلية 100%.',
  alternates: {
    canonical: canonicalUrl
  },
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function ProfilePage() {
  return (
    <LibraryProvider>
      <div
        dir="ltr"
        className="min-h-screen bg-bg text-text font-arabic antialiased flex flex-col selection:bg-accent selection:text-accent-ink"
      >
        <StandaloneHeader current="profile" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
          {/* مسار التنقل الدلالي Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <span>/</span>
            <span className="text-text font-bold">حسابي ومحفظتي التعليمية</span>
          </nav>

          <StudentProfileHub />
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
