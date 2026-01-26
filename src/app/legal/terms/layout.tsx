import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | VERA Neural',
  description: 'Terms of Service for VERA Neural. Read our terms and conditions for using the VERA emotional wellness platform.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
