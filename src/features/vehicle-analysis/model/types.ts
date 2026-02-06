export type FuelType = 'petrol' | 'diesel' | 'gas' | 'hybrid' | 'electric';

export interface VehicleFormData {
  vin: string;
  makeModel?: string;
  year?: number;
  mileage?: number;
  price?: number;
  fuelType?: FuelType;
  engineCapacity?: number;
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
  checksumValid?: boolean;
  isEuropeanVIN?: boolean;
  decodingSource?: 'nhtsa' | 'local';
}

export interface AnalysisResult {
  decodedVIN: DecodedVIN | null;
  analysis: string;
  timestamp: string;
}

export interface StreamingAnalysisState {
  decodedVIN: DecodedVIN | null;
  streamedText: string;
  isDecodingVIN: boolean;
  isStreaming: boolean;
  isComplete: boolean;
  error: string | null;
}

export type RecommendationType = 'recommend' | 'caution' | 'not_recommend';

export type FeedbackRating = 'positive' | 'negative';

export interface FeedbackData {
  rating: FeedbackRating;
  comment?: string;
  vehicle?: string;
}
