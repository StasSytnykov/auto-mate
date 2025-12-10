export interface VehicleFormData {
  vin: string;
  makeModel?: string;
  year?: number;
  mileage?: number;
  price?: number;
  sellerDescription?: string;
  userQuestion?: string;
}

export interface DecodedVIN {
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  engineType: string;
  engineDisplacement: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  bodyClass: string;
  plantCountry: string;
  plantCity: string;
  errorCode?: string;
  errorText?: string;
  // Metadata from enhanced decoder
  checksumValid?: boolean;
  isEuropeanVIN?: boolean;
  decodingSource?: 'nhtsa' | 'local';
}

export interface AnalysisResult {
  decodedVIN: DecodedVIN | null;
  analysis: string;
  timestamp: string;
}

export type RecommendationType = 'recommend' | 'caution' | 'not_recommend';
