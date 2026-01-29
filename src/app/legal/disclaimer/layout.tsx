import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | VERA Neural',
  description: 'Important medical disclaimer for VERA Neural. VERA is not a substitute for professional mental health care.',
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
