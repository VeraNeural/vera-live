import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | VERA Neural',
  description: 'Learn how VERA Neural protects your privacy and handles your personal data. GDPR and CCPA compliant privacy practices.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
