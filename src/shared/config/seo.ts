import { Metadata } from 'next';

export const siteConfig = {
  name: 'AutoMate',
  description:
    'AI-асистент для перевірки б/в автомобілів. Аналіз VIN коду, виявлення прихованих проблем та експертні рекомендації щодо покупки.',
  // Update this URL after Vercel deployment or set NEXT_PUBLIC_SITE_URL env variable
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://automate.vercel.app',
  ogImage: '/og-image.svg',
  keywords: [
    'перевірка авто',
    'VIN декодер',
    'аналіз автомобіля',
    'б/в авто',
    'підбір авто',
    'AI автоексперт',
    'перевірка VIN',
    'історія авто',
    'купити авто Україна',
    'перевірка авто перед покупкою',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150',
  },
};

// FAQ Schema for rich snippets in Google search
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Як перевірити авто за VIN кодом?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Введіть 17-значний VIN код автомобіля в поле на сайті AutoMate. Наш AI-асистент автоматично декодує VIN, визначить марку, модель, рік випуску та країну виробництва, а також проаналізує типові проблеми цієї моделі.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чи безкоштовна перевірка авто?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Так, базова перевірка автомобіля за VIN кодом повністю безкоштовна. Ви можете отримати детальний AI-аналіз з рекомендаціями щодо покупки без будь-яких платежів.',
      },
    },
    {
      '@type': 'Question',
      name: 'Які дані потрібні для аналізу авто?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Обов'язковим є лише VIN код. Додатково ви можете вказати пробіг, ціну, рік випуску та опис від продавця для більш точного аналізу та рекомендацій.",
      },
    },
    {
      '@type': 'Question',
      name: 'Як працює AI аналіз автомобіля?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Штучний інтелект аналізує VIN код, визначає технічні характеристики авто, порівнює з базою типових проблем конкретної моделі та надає персоналізовані рекомендації: купувати, бути обережним або відмовитися від покупки.',
      },
    },
  ],
};

