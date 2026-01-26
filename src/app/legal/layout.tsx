import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | VERA Neural',
    default: 'Legal | VERA Neural',
  },
  description: 'Legal information for VERA Neural - Privacy Policy, Terms of Service, and more.',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
