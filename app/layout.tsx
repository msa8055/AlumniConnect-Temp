import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'AlumniConnect - University Alumni Management System',
  description: 'Connect with alumni, find mentors, discover job opportunities, and grow your professional network. The complete platform for university alumni engagement.',
  keywords: ['alumni', 'university', 'networking', 'mentorship', 'jobs', 'career', 'events'],
  authors: [{ name: 'AlumniConnect' }],
  creator: 'AlumniConnect',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alumniconnect.edu',
    siteName: 'AlumniConnect',
    title: 'AlumniConnect - University Alumni Management System',
    description: 'Connect with alumni, find mentors, discover job opportunities, and grow your professional network.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlumniConnect',
    description: 'University Alumni Management System',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b5998' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
