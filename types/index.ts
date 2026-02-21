export type CryptoType = 'bitcoin' | 'ethereum' | 'solana' | 'xrp';

export interface FormInputs {
  crypto: CryptoType;
  initialCapital: number;
  monthlyAddition: number;
  startDate: Date;
  endDate: Date;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface ChartDataPoint {
  date: string;
  portfolioValue: number;
  investedCapital: number;
}

export interface CalculationMethodDetails {
  initialPrice: number;
  finalPrice: number;
  totalCryptoQuantity: number;
  monthlyInvestmentsCount: number;
}

export interface CalculationResult {
  totalInvested: number;
  finalValue: number;
  roi: number;
  roiPercentage: number;
  chartData: ChartDataPoint[];
  method?: CalculationMethodDetails;
}

export interface DCAResult {
  dates: Date[];
  portfolioValues: number[];
  investedCapital: number[];
  cryptoQuantity: number[];
  prices: number[];
}
