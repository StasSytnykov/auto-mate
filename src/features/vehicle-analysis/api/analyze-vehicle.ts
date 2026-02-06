import { DecodedVIN, FuelType, VehicleFormData } from '../model/types';

const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  gas: 'Газ/Бензин',
  hybrid: 'Гібрид',
  electric: 'Електро',
};

export const SYSTEM_INSTRUCTION = `
Ти - досвідчений, цинічний та чесний автоексперт з 15+ роками досвіду ("перекуп", який став на бік добра).
Твій стиль: прямий, іронічний, але турботливий до гаманця покупця.

## 👤 Твій клієнт:
Уяви, що ти допомагаєш своєму другу, який **зовсім не розбирається в машинах** (гуманітарій). 
Він не знає, що таке "сайлентблок" чи "ГБЦ". Твоє завдання - не вразити його термінами, а **пояснити "на пальцях"**, чим загрожує та чи інша поломка.
Якщо використовуєш сленг (наприклад: "масложор", "пінки", "троїть") - **обов'язково пояснюй у дужках простій мові**, що це означає і скільки коштує виправити.

Твоя мета - знайти причину НЕ купувати авто, або попередити про майбутні витрати, або порекомендувати інше авто, якщо цей варіант авто поганий.

## Вхідні дані:
1. JSON з даними про авто (користувач + декодер).
2. Опис продавця (з оголошення).
3. Питання користувача (якщо є).

## ⚠️ ЛОГІКА ОБРОБКИ VIN (NHTSA API Limitations):
Ми використовуємо базу США (NHTSA). Вона НЕ знає європейських/азіатських авто.
1. **VIN починається з 1, 4, 5 (США):** Аналізуй дані з декодера. Якщо Checksum Fail - це ЧЕРВОНИЙ прапор.
2. **VIN починається з інших символів (Європа/Азія):**
   - ПОВНІСТЮ ІГНОРУЙ помилки декодера, "Checksum Validation Failed", "Year 0" тощо.
   - Базуйся ВИКЛЮЧНО на даних користувача.
   - В секції VIN напиши: "Європейський/Азіатський формат. Перевірка по базах США неможлива. Аналіз базується на загальній статистиці моделі".

## 💰 Орієнтир цін на ремонт (База 2024 Україна):
Масштабуй ціни залежно від класу авто (S-Class = x3, Lanos = /1.5).
- Ланцюг ГРМ: $400-800
- Турбіна: $500-1500
- DSG/PowerShift (робот): $800-2000
- Паливна система (Diesel): $300-1000
- Фарбування деталі: $100-150

## ФОРМАТ ВІДПОВІДІ (MarkDown):

## 💡 Вердикт: [ОБЕРІТЬ: 🟢 БЕРИ / 🟡 ДУМАЙ / 🔴 ТІКАЙ]
Одне просте речення-висновок зрозумілою мовою.
*Приклад: "Машина надійна, але пробіг скручений – готуй $1000 на ремонт двигуна."*

## 🗣 Відповідь на ваше питання
(Якщо є питання від користувача - відповідай тут максимально просто, без зайвої "води". Поясни як для новачка).

## 📊 Експрес-аналіз
Модель, покоління.
- **Ризики:** [Головні 2-3 проблеми]. Поясни, чому це погано (наприклад: "Тонкий метал - швидко згниє").
- **Для кого це авто:** (Наприклад: "Для таксі", "Для сім'ї", "Для тих, хто любить жити на СТО").

## 💰 Гроші
- **Ринкова ціна:** $X - $Y (Україна).
- **Справедлива ціна:** Оцінка ціни в оголошенні.
- **Торг:** Скільки просити знижки і за що (наприклад: "Скинь $300 за лису гуму").

## 🚩 Червоні прапорці (Аналіз опису)
Розбий "казки" продавця.
- Якщо пише "сів поїхав" про старе авто - поясни, що це брехня.
- Якщо пише "фарбована лише одна деталь" - поясни, що треба перевіряти товщиноміром.

## 🔧 Технічка (Простими словами про складне)
### Двигун
- Ресурс: Скільки ще поїздить до серйозного ремонту.
- Масложор: Чи треба возити каністру масла в багажнику?
- ГРМ: Коли міняти і чи дорого це (для цієї моделі).

### Коробка передач
- Тип: (Автомат/Робот/Варіатор/Механіка).
- Надійність: Чи "штовхається" вона на цьому пробігу? Скільки коштує ремонт, якщо вона "вмре"?

### Кузов та Ходова
- Чи гниє ця модель? (Пороги, арки).
- Підвіска: Чи м'яка і чи дорого перебирати по наших дорогах?

## 📋 Чек-лист для СТО (Покажи це механіку)
Напишіть 3-5 пунктів, куди механік має тицьнути пальцем.
1. [Що перевірити] - [Чому це важливо]
2. ...

---
*Дисклеймер: Я штучний інтелект. Я аналізую дані, але не бачу машину вживу. Обов'язково заженіть авто на підйомник перед покупкою.*
`;

// Check if VIN is North American (checksum validation only applies to these)
function isNorthAmericanVIN(vin: string): boolean {
  const firstChar = vin.charAt(0).toUpperCase();
  return ['1', '2', '3', '4', '5'].includes(firstChar);
}

// Exported for use in streaming endpoint
export function buildPrompt(formData: VehicleFormData, decodedVIN: DecodedVIN | null): string {
  let prompt = '## Дані про автомобіль\n\n';

  const vin = formData.vin.toUpperCase();
  const isNorthAmerican = isNorthAmericanVIN(vin);

  prompt += `**VIN код:** ${vin}\n`;

  if (!isNorthAmerican) {
    // Non-American VIN - clearly state database limitations
    prompt += `\n### ℹ️ Неамериканський VIN (${vin.charAt(0)}):\n`;
    prompt += `Цей VIN код належить неамериканському авто. База NHTSA (США) НЕ підтримує такі VIN коди.\n`;
    prompt += `**Будь-які "помилки" декодування (невалідна контрольна сума, невідома модель, рік 0) - це обмеження бази, а НЕ проблема з авто!**\n`;
    prompt += `Аналізуй авто ВИКЛЮЧНО на основі даних користувача нижче.\n`;
  } else if (decodedVIN) {
    // American VIN with decoded data
    prompt += `\n### Декодований VIN:\n`;
    prompt += `- **Марка:** ${decodedVIN.make}\n`;
    prompt += `- **Модель:** ${decodedVIN.model}\n`;
    prompt += `- **Рік випуску:** ${decodedVIN.year}\n`;
    prompt += `- **Тип кузова:** ${decodedVIN.bodyClass}\n`;
    prompt += `- **Тип транспорту:** ${decodedVIN.vehicleType}\n`;
    prompt += `- **Двигун:** ${decodedVIN.engineType} (${decodedVIN.engineDisplacement})\n`;
    prompt += `- **Паливо:** ${decodedVIN.fuelType}\n`;
    prompt += `- **Трансмісія:** ${decodedVIN.transmission}\n`;
    prompt += `- **Привід:** ${decodedVIN.driveType}\n`;
    prompt += `- **Країна виробництва:** ${decodedVIN.plantCountry}\n`;
    if (decodedVIN.plantCity && decodedVIN.plantCity !== 'Невідомо') {
      prompt += `- **Місто виробництва:** ${decodedVIN.plantCity}\n`;
    }

    // Checksum warning ONLY for North American VINs
    if (decodedVIN.checksumValid === false) {
      prompt += `- **⚠️ УВАГА:** Контрольна сума VIN не валідна - можливо перебитий VIN!\n`;
    }
    if (decodedVIN.errorText) {
      prompt += `- **Примітка API:** ${decodedVIN.errorText}\n`;
    }
  } else {
    // American VIN but not decoded
    prompt += `\n### ℹ️ VIN не декодовано:\n`;
    prompt += `База даних NHTSA не змогла декодувати цей VIN код.\n`;
  }

  // User provided data section
  prompt += `\n### Дані від користувача:\n`;

  if (formData.makeModel) {
    prompt += `- **Марка та модель:** ${formData.makeModel}\n`;
  }

  if (formData.year) {
    prompt += `- **Рік:** ${formData.year}\n`;
    // Flag year mismatch ONLY for North American VINs with valid year data (year > 1980)
    if (
      isNorthAmerican &&
      decodedVIN &&
      decodedVIN.year &&
      decodedVIN.year > 1980 &&
      Math.abs(decodedVIN.year - formData.year) > 1
    ) {
      prompt += `  - **⚠️ НЕВІДПОВІДНІСТЬ:** VIN показує ${decodedVIN.year} рік, користувач вказав ${formData.year}!\n`;
    }
  }

  if (formData.mileage) {
    // User enters mileage in thousands, convert to actual km
    const actualMileage = formData.mileage * 1000;
    prompt += `- **Пробіг:** ${actualMileage.toLocaleString('uk-UA')} км\n`;
    // Add mileage context
    const avgKmPerYear = formData.year ? Math.round(actualMileage / (new Date().getFullYear() - formData.year)) : null;
    if (avgKmPerYear) {
      prompt += `  - *Середній пробіг:* ~${avgKmPerYear.toLocaleString('uk-UA')} км/рік`;
      if (avgKmPerYear > 30000) {
        prompt += ` (високий - ймовірно таксі/корпоративне авто)`;
      } else if (avgKmPerYear < 8000) {
        prompt += ` (низький - можливо скручений)`;
      } else {
        prompt += ` (нормальний)`;
      }
      prompt += `\n`;
    }
  }

  if (formData.price) {
    prompt += `- **Ціна:** $${formData.price.toLocaleString('uk-UA')}\n`;
  }

  if (formData.fuelType) {
    prompt += `- **Тип палива:** ${FUEL_TYPE_LABELS[formData.fuelType]}\n`;
  }

  if (formData.engineCapacity) {
    prompt += `- **Об'єм двигуна:** ${formData.engineCapacity} л\n`;
  }

  if (formData.sellerDescription) {
    prompt += `\n### Опис від продавця:\n\`\`\`\n${formData.sellerDescription}\n\`\`\`\n`;
  }

  if (formData.userQuestion) {
    prompt += `\n### 🎯 Питання від покупця (ОБОВ'ЯЗКОВО відповісти):\n${formData.userQuestion}\n`;
  }

  prompt += '\n---\n\nПроаналізуй цей автомобіль детально та надай структуровані рекомендації згідно формату.';

  return prompt;
}
