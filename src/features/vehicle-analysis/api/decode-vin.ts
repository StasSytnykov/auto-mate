import { DecodedVIN } from '../model/types';

const NHTSA_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues';

// VIN year codes (position 10)
const YEAR_CODES: Record<string, number> = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026,
  V: 2027,
  W: 2028,
  X: 2029,
  Y: 2030,
  '1': 2001,
  '2': 2002,
  '3': 2003,
  '4': 2004,
  '5': 2005,
  '6': 2006,
  '7': 2007,
  '8': 2008,
  '9': 2009,
};

// WMI (World Manufacturer Identifier) - first 3 characters
const MANUFACTURER_CODES: Record<string, { make: string; country: string }> = {
  // German manufacturers
  WVW: { make: 'Volkswagen', country: 'Німеччина' },
  WV1: { make: 'Volkswagen Commercial', country: 'Німеччина' },
  WV2: { make: 'Volkswagen', country: 'Німеччина' },
  WV3: { make: 'Volkswagen', country: 'Німеччина' },
  WUA: { make: 'Audi', country: 'Німеччина' },
  WAU: { make: 'Audi', country: 'Німеччина' },
  WA1: { make: 'Audi', country: 'Німеччина' },
  WBA: { make: 'BMW', country: 'Німеччина' },
  WBS: { make: 'BMW M', country: 'Німеччина' },
  WBY: { make: 'BMW i', country: 'Німеччина' },
  WDB: { make: 'Mercedes-Benz', country: 'Німеччина' },
  WDC: { make: 'Mercedes-Benz', country: 'Німеччина' },
  WDD: { make: 'Mercedes-Benz', country: 'Німеччина' },
  WDF: { make: 'Mercedes-Benz', country: 'Німеччина' },
  WMW: { make: 'Mini', country: 'Німеччина' },
  WP0: { make: 'Porsche', country: 'Німеччина' },
  WP1: { make: 'Porsche', country: 'Німеччина' },
  WF0: { make: 'Ford', country: 'Німеччина' },
  WOL: { make: 'Opel', country: 'Німеччина' },
  // Czech
  TRU: { make: 'Audi', country: 'Угорщина' },
  TM9: { make: 'Skoda', country: 'Чехія' },
  TMB: { make: 'Skoda', country: 'Чехія' },
  TMP: { make: 'Skoda', country: 'Чехія' },
  // French
  VF1: { make: 'Renault', country: 'Франція' },
  VF3: { make: 'Peugeot', country: 'Франція' },
  VF7: { make: 'Citroen', country: 'Франція' },
  // Italy
  ZAR: { make: 'Alfa Romeo', country: 'Італія' },
  ZFA: { make: 'Fiat', country: 'Італія' },
  ZFF: { make: 'Ferrari', country: 'Італія' },
  ZHW: { make: 'Lamborghini', country: 'Італія' },
  ZAM: { make: 'Maserati', country: 'Італія' },
  // Japan
  JTD: { make: 'Toyota', country: 'Японія' },
  JTE: { make: 'Toyota', country: 'Японія' },
  JTM: { make: 'Toyota', country: 'Японія' },
  JHM: { make: 'Honda', country: 'Японія' },
  JN1: { make: 'Nissan', country: 'Японія' },
  JMZ: { make: 'Mazda', country: 'Японія' },
  JS3: { make: 'Suzuki', country: 'Японія' },
  JF1: { make: 'Subaru', country: 'Японія' },
  JF2: { make: 'Subaru', country: 'Японія' },
  // Korea
  KMH: { make: 'Hyundai', country: 'Корея' },
  KNA: { make: 'Kia', country: 'Корея' },
  KNC: { make: 'Kia', country: 'Корея' },
  KND: { make: 'Kia', country: 'Корея' },
  // UK
  SAL: { make: 'Land Rover', country: 'Великобританія' },
  SAJ: { make: 'Jaguar', country: 'Великобританія' },
  // Sweden
  YV1: { make: 'Volvo', country: 'Швеція' },
  YV4: { make: 'Volvo', country: 'Швеція' },
  // USA
  '1G1': { make: 'Chevrolet', country: 'США' },
  '1G2': { make: 'Pontiac', country: 'США' },
  '1GC': { make: 'Chevrolet Truck', country: 'США' },
  '1FA': { make: 'Ford', country: 'США' },
  '1FT': { make: 'Ford Truck', country: 'США' },
  '2FA': { make: 'Ford', country: 'Канада' },
  '3FA': { make: 'Ford', country: 'Мексика' },
  '5YJ': { make: 'Tesla', country: 'США' },
  // Poland
  SUP: { make: 'Volkswagen', country: 'Польща' },
};

// Volkswagen model codes (position 4-6 for some models)
const VW_MODEL_HINTS: Record<string, string> = {
  '3C': 'Passat',
  '1K': 'Golf/Jetta',
  '5K': 'Golf',
  '5C': 'Beetle',
  AU: 'Golf',
  '1J': 'Golf/Bora',
  '7N': 'Sharan',
  '7P': 'Touareg',
  '5N': 'Tiguan',
  '2G': 'Polo',
  '1T': 'Touran',
  '3G': 'Passat B8',
  AD: 'Polo',
  BZ: 'Touran',
  CA: 'Atlas',
  NF: 'Arteon',
};

interface NHTSAResponse {
  Results: Array<Record<string, string>>;
}

function getCountryFromWMI(vin: string): string {
  const firstChar = vin.charAt(0).toUpperCase();
  const countryMap: Record<string, string> = {
    W: 'Німеччина',
    V: 'Франція/Іспанія',
    Z: 'Італія',
    S: 'Великобританія/Польща',
    T: 'Чехія/Угорщина',
    J: 'Японія',
    K: 'Корея',
    L: 'Китай',
    Y: 'Швеція/Фінляндія',
    '1': 'США',
    '2': 'Канада',
    '3': 'Мексика',
    '4': 'США',
    '5': 'США',
    '6': 'Австралія',
    '9': 'Бразилія',
  };
  return countryMap[firstChar] || 'Невідомо';
}

function decodeYearFromVIN(vin: string): number | null {
  const yearChar = vin.charAt(9).toUpperCase();
  const baseYear = YEAR_CODES[yearChar];

  if (!baseYear) return null;

  // If the year code gives us 2001-2009, it could also be 1971-1979 or 2031-2039
  // For modern cars (first char W, V, etc.), assume 2000s
  if (baseYear >= 2001 && baseYear <= 2009) {
    // Check if it's likely a 1980s/1990s car or 2000s
    // European manufacturers in 2000s are common
    return baseYear;
  }

  return baseYear;
}

function decodeManufacturerFromVIN(vin: string): { make: string; country: string } | null {
  const wmi = vin.substring(0, 3).toUpperCase();

  // Try exact match first
  if (MANUFACTURER_CODES[wmi]) {
    return MANUFACTURER_CODES[wmi];
  }

  // Try 2-character prefix
  const wmi2 = vin.substring(0, 2).toUpperCase();
  for (const [code, info] of Object.entries(MANUFACTURER_CODES)) {
    if (code.startsWith(wmi2)) {
      return info;
    }
  }

  return null;
}

function getVWModelHint(vin: string): string | null {
  // For VW, check positions 4-5 or 6-7
  const hint1 = vin.substring(3, 5).toUpperCase();
  const hint2 = vin.substring(5, 7).toUpperCase();
  const hint3 = vin.substring(6, 8).toUpperCase();

  return VW_MODEL_HINTS[hint1] || VW_MODEL_HINTS[hint2] || VW_MODEL_HINTS[hint3] || null;
}

function validateVINChecksum(vin: string): boolean {
  // VIN checksum validation (position 9)
  // Note: European VINs don't always follow this strictly
  const transliteration: Record<string, number> = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
  };

  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = transliteration[char];
    if (value === undefined) return false;
    sum += value * weights[i];
  }

  const remainder = sum % 11;
  const checkDigit = vin.charAt(8).toUpperCase();
  const expectedCheck = remainder === 10 ? 'X' : String(remainder);

  return checkDigit === expectedCheck;
}

export async function decodeVIN(vin: string): Promise<DecodedVIN> {
  const upperVIN = vin.toUpperCase();

  // Extract basic info from VIN structure
  const localManufacturer = decodeManufacturerFromVIN(upperVIN);
  const localYear = decodeYearFromVIN(upperVIN);
  const localCountry = getCountryFromWMI(upperVIN);
  const checksumValid = validateVINChecksum(upperVIN);

  // Try NHTSA API
  let nhtsaData: Record<string, string> | null = null;
  try {
    const response = await fetch(`${NHTSA_API_URL}/${upperVIN}?format=json`);

    if (response.ok) {
      const data: NHTSAResponse = await response.json();
      nhtsaData = data.Results[0] || null;
    }
  } catch (error) {
    console.error('NHTSA API error:', error);
  }

  // Determine if NHTSA data is reliable
  const nhtsaErrorCode = nhtsaData?.ErrorCode || '';
  const nhtsaHasError = nhtsaErrorCode && nhtsaErrorCode !== '0' && !nhtsaErrorCode.includes('0');
  const nhtsaYear = parseInt(nhtsaData?.ModelYear || '0') || 0;

  // Validate NHTSA year against our decoded year
  const yearMismatch = localYear && nhtsaYear && Math.abs(nhtsaYear - localYear) > 2;

  // Use local decoding for European VINs if NHTSA gives bad data
  const isEuropeanVIN = ['W', 'V', 'Z', 'S', 'T', 'Y'].includes(upperVIN.charAt(0));
  const useLocalDecoding = isEuropeanVIN && (nhtsaHasError || yearMismatch || !nhtsaData);

  // Build result, preferring reliable sources
  const make = useLocalDecoding
    ? localManufacturer?.make || 'Невідомо'
    : nhtsaData?.Make || localManufacturer?.make || 'Невідомо';

  let model = useLocalDecoding ? 'Невідомо' : nhtsaData?.Model || 'Невідомо';

  // Add VW model hints for European VINs
  if ((model === 'Невідомо' || useLocalDecoding) && (make === 'Volkswagen' || make === 'VOLKSWAGEN')) {
    const vwHint = getVWModelHint(upperVIN);
    if (vwHint) {
      model = vwHint;
    }
  }

  const year = useLocalDecoding ? localYear || 0 : nhtsaYear || localYear || 0;

  const plantCountry = useLocalDecoding
    ? localManufacturer?.country || localCountry
    : nhtsaData?.PlantCountry || localManufacturer?.country || localCountry;

  // Build engine info
  let engineType = 'Невідомо';
  let engineDisplacement = 'Невідомо';

  if (nhtsaData && !useLocalDecoding) {
    const cylinders = nhtsaData.EngineCylinders;
    const engineModel = nhtsaData.EngineModel;
    if (cylinders || engineModel) {
      engineType = `${cylinders ? cylinders + ' циліндрів' : ''} ${engineModel || ''}`.trim() || 'Невідомо';
    }
    if (nhtsaData.DisplacementL) {
      engineDisplacement = `${nhtsaData.DisplacementL}L`;
    }
  }

  return {
    make,
    model,
    year,
    vehicleType: nhtsaData?.VehicleType || 'Легковий автомобіль',
    engineType,
    engineDisplacement,
    fuelType: nhtsaData?.FuelTypePrimary || 'Невідомо',
    transmission: nhtsaData?.TransmissionStyle || 'Невідомо',
    driveType: nhtsaData?.DriveType || 'Невідомо',
    bodyClass: nhtsaData?.BodyClass || 'Невідомо',
    plantCountry,
    plantCity: nhtsaData?.PlantCity || 'Невідомо',
    errorCode: nhtsaHasError ? nhtsaErrorCode : undefined,
    errorText: nhtsaHasError ? nhtsaData?.ErrorText : undefined,
    // Additional metadata
    checksumValid,
    isEuropeanVIN,
    decodingSource: useLocalDecoding ? 'local' : 'nhtsa',
  };
}
