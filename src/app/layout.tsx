import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "LaundryBox - Professional Laundry Management System",
    template: "%s | LaundryBox"
  },
  description: "Comprehensive laundry service management platform with real-time analytics, order tracking, inventory management, and customer relationship tools.",
  keywords: ['laundry management', 'laundry service', 'business management', 'order tracking', 'inventory management'],
  authors: [{ name: 'LaundryBox' }],
  creator: 'LaundryBox',
  publisher: 'LaundryBox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'LaundryBox - Professional Laundry Management System',
    description: 'Comprehensive laundry service management platform',
    url: 'http://localhost:3000',
    siteName: 'LaundryBox',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ibmPlexSans.variable}>
      <head>
        <link rel="dns-prefetch" href="http://172.19.240.1:7777" />
        <link rel="preconnect" href="http://172.19.240.1:7777" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
