# AutoMate - AI Перевірка б/в Автомобілів

AI-асистент для перевірки б/в автомобілів. Аналіз VIN коду, виявлення прихованих проблем та експертні рекомендації щодо покупки.

## Технології

- **Next.js 15** - React framework з App Router
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Компоненти UI
- **Google Gemini API** - AI для аналізу автомобілів
- **NHTSA vPIC API** - Декодування VIN коду
- **Zod** - Валідація даних
- **TypeScript** - Типізація

## Архітектура

Проєкт побудований за принципами **Feature-Sliced Design**:

```
src/
├── app/                          # Next.js App Router
│   ├── api/analyze/              # API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Головна сторінка
│   ├── robots.ts                 # SEO robots
│   └── sitemap.ts                # SEO sitemap
├── features/
│   └── vehicle-analysis/         # Головна фіча
│       ├── ui/                   # UI компоненти
│       ├── model/                # Типи та схеми
│       └── api/                  # API клієнти
├── shared/
│   ├── ui/                       # Базові UI компоненти
│   ├── lib/                      # Утиліти
│   └── config/                   # Конфігурації
└── widgets/
    └── header/                   # Header компонент
```

## Запуск

### Передумови

- Node.js >= 20.9.0
- npm або yarn
- Google Gemini API ключ

### Встановлення

1. Клонуйте репозиторій:

```bash
git clone <repository-url>
cd auto-mate
```

2. Встановіть залежності:

```bash
npm install
```

3. Створіть файл `.env.local` та додайте API ключ:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Отримати API ключ можна тут: https://aistudio.google.com/app/apikey

4. Запустіть dev сервер:

```bash
npm run dev
```

5. Відкрийте http://localhost:3000

## Функціональність

### Форма введення даних

- **VIN код** (обов'язково) - 17-значний ідентифікаційний номер
- Марка та модель
- Рік випуску
- Пробіг
- Ціна
- Опис від продавця
- Додаткові питання до AI

### AI Аналіз

- Декодування VIN через NHTSA API
- Технічний аналіз (двигун, коробка, кузов, електроніка)
- Виявлення червоних прапорців
- Оптимальні умови для покупки
- Чітка рекомендація (Рекомендую / Обережно / Не рекомендую)

## SEO

- Structured metadata
- Open Graph / Twitter cards
- JSON-LD schema (WebApplication)
- robots.txt та sitemap.xml
- Семантичний HTML

## Скрипти

```bash
npm run dev      # Запуск dev сервера
npm run build    # Production збірка
npm run start    # Запуск production сервера
npm run lint     # Перевірка ESLint
```

## Ліцензія

MIT
