import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Header } from '@/widgets/header';
import { defaultMetadata, jsonLd, siteConfig } from '@/shared/config/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0a0f1a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen`}
      >
        <Header />
        <main>{children}</main>
        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} {siteConfig.name}. Всі права захищені.</p>
            <p className="mt-1 text-xs text-slate-600">
              AI-аналіз надається лише для інформаційних цілей. Завжди проводьте професійну діагностику перед покупкою.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
