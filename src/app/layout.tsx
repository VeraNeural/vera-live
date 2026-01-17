import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Providers from './providers'
import PwaClient from '@/components/pwa/PwaClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "VERA",
  description: "AI that helps you do anything, your way, your pace",
  applicationName: 'VERA',
  manifest: '/manifest.json',
  themeColor: '#6D28D9',
  appleWebApp: {
    capable: true,
    title: 'VERA',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <ThemeProvider>
              {children}
              <PwaClient />
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}