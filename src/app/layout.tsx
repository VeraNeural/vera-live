import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Providers from './providers'

export const metadata: Metadata = {
  title: "VERA",
  description: "AI that helps you do anything, your way, your pace",
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
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}