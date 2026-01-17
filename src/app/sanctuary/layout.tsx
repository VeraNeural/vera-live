import React from 'react';
import PageTransition from '@/components/sanctuary/PageTransition';

export default function SanctuaryLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
