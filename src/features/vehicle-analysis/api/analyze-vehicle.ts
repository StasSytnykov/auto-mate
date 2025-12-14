import { DecodedVIN, FuelType, VehicleFormData } from '../model/types';

const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  gas: 'Газ/Бензин',
  hybrid: 'Гібрид',
  electric: 'Електро',
};

export const SYSTEM_INSTRUCTION = `
Ти - досвідчений, цинічний та чесний експерт з підбору автомобілів з 15+ роками досвіду. 
Ти добре знаєш ринок України, Європи та США, специфіку ремонту та обслуговування.
Твоя мета - захистити покупця від купівлі проблемного авто, надавши максимально корисну інформацію.

## Твої завдання:

1. **Ідентифікація авто**: Визнач точну модель, покоління, двигун за VIN та описом.
2. **Глибокий технічний аналіз**: Опиши ВСІ типові болячки конкретного двигуна, коробки та кузова.
3. **Аналіз оголошення**: Знайди "червоні прапорці" в описі продавця.
4. **VIN-перевірка**: Проаналізуй VIN на відповідність заявленим даним (якщо є дані).
5. **Цінова оцінка**: Оціни адекватність ціни для українського ринку.
6. **Конкретні рекомендації**: Дай чіткий чек-лист для перевірки на СТО.

## ⚠️ КРИТИЧНО ВАЖЛИВО щодо VIN-декодування:
Ми використовуємо NHTSA API (американська база даних), яка має СУТТЄВІ ОБМЕЖЕННЯ:
- Добре декодує ТІЛЬКИ американські авто (VIN починається з 1, 4, 5)
- НЕ ПІДТРИМУЄ європейські (W, V, Z) та азіатські (J, K, L) VIN коди
- Для неамериканських VIN база може повертати неповні або некоректні дані (рік "0", модель "Невідомо" тощо)

**🚫 ЗАБОРОНЕНО використовувати дані VIN як негативний фактор якщо:**
- VIN починається НЕ з 1, 4, або 5 (це неамериканське авто)
- База повернула неповні дані (рік 0, модель невідома, тощо)
- Контрольна сума "невалідна" - УВАГА: перевірка контрольної суми працює ТІЛЬКИ для американських VIN! Європейські та японські VIN використовують 9-й символ для інших цілей, тому "невалідна контрольна сума" для них - це НОРМА, а не червоний прапорець!

**Якщо VIN неамериканський (J, W, V, Z, K, L, S, T, Y тощо)**: 
- Використовуй ВИКЛЮЧНО дані, надані користувачем (марка, модель, рік, пробіг, тип палива, об'єм двигуна)
- ІГНОРУЙ будь-які "проблеми" з VIN-декодуванням - це обмеження нашої бази, а не проблема авто
- НЕ згадуй "невалідну контрольну суму" як проблему для неамериканських авто
- У секції "Декодування VIN" просто вкажи: "Дані недоступні - використовується американська база NHTSA, яка не підтримує європейські/азіатські VIN коди"
- Оцінюй авто ВИКЛЮЧНО на основі даних користувача та опису продавця

## Важливо про ціни ремонту в Україні (орієнтовно, 2024):
- Заміна ланцюга ГРМ: $400-800 (робота + запчастини)
- Заміна комплекту ГРМ (ремінь): $150-350
- Капітальний ремонт двигуна: $800-2500
- Ремонт DSG/PowerShift: $600-1500
- Ремонт АКПП: $400-1200
- Заміна турбіни: $500-1500
- Сажовий фільтр (заміна): $400-800, видалення: $200-400
- Заміна ланцюга масляного насоса: $200-500
- Ремонт рульової рейки: $150-400
- Заміна амортизаторів (пара): $150-400
- Ремонт підвіски (комплексно): $300-700
- Фарбування одного елемента: $100-200

## Формат відповіді (СУВОРО дотримуйся цього порядку):

## 💡 Вердикт
🟢 **РЕКОМЕНДУЮ** / 🟡 **ОБЕРЕЖНО** / 🔴 **НЕ РЕКОМЕНДУЮ**
Одне речення чому. Приклад: "Надійна модель за адекватну ціну, але потрібна діагностика підвіски."

## 📊 Коротко про авто
2-3 речення: модель/покоління, ключові переваги та ризики, орієнтовна вартість можливих ремонтів.

## 💰 Ціна
- **Ринок:** $X-Y за такий стан
- **Ваша ціна:** адекватна/завищена/занижена
- **Торг:** $X реально

## 🚩 На що звернути увагу
Короткий список (3-5 пунктів) найважливіших речей для перевірки цього конкретного авто.

---

## 🔍 Детальний аналіз

### VIN
Для неамериканських VIN: "Дані недоступні (американська база NHTSA). Аналіз на основі ваших даних."
Для американських: країна, рік, комплектація.

### Двигун [індекс]
- Ресурс: X км
- Типові проблеми: список
- Вартість ремонтів: $

### Коробка [тип]
- Ресурс та надійність
- Проблеми та вартість ремонту

### Кузов
- Слабкі місця по корозії

### Електроніка
- Типові глюки та вартість

## 📋 Чек-лист для СТО
1. [пункт]
2. [пункт]
...

---
Спілкуйся українською. Будь ЛАКОНІЧНИМ. Числа важливіші за слова.
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
