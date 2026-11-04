import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'لوحة التحكم الفورية | AIProdZone',
  description: 'لوحة التحكم الإدارية وإدارة الكتالوج الأكاديمي لمنصة AIProdZone',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return <>{children}</>;
}
