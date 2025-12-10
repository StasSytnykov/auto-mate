import { Metadata } from 'next';

export const siteConfig = {
  name: 'AutoMate',
  description:
    'AI-асистент для перевірки б/в автомобілів. Аналіз VIN коду, виявлення прихованих проблем та експертні рекомендації щодо покупки.',
  url: 'https://automate.ua',
  ogImage: '/og-image.png',
  keywords: [
    'перевірка авто',
    'VIN декодер',
    'аналіз автомобіля',
    'б/в авто',
    'підбір авто',
    'AI автоексперт',
    'перевірка VIN',
    'історія авто',
    'Україна',
  ],
  author: 'AutoMate Team',
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI Перевірка б/в Автомобілів`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: siteConfig.url,
    title: `${siteConfig.name} - AI Перевірка б/в Автомобілів`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - AI Перевірка б/в Автомобілів`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'UAH',
  },
  inLanguage: 'uk-UA',
};

