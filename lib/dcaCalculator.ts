import { DCAResult, CalculationResult, ChartDataPoint, PriceData } from '@/types';

export function calculateDCA(
  initialCapital: number,
  monthlyAddition: number,
  startDate: Date,
  endDate: Date,
  historicalPrices: PriceData[]
): DCAResult {
  const dates: Date[] = [];
  const portfolioValues: number[] = [];
  const investedCapital: number[] = [];
  const cryptoQuantity: number[] = [];
  const prices: number[] = [];

  let totalCryptoQuantity = 0;
  let totalInvestedAmount = 0;

  // Initial investment at selected start date (or closest available before that date)
  const initialPrice = findPriceAtOrBeforeDate(startDate, historicalPrices);
  if (initialPrice !== null) {
    totalCryptoQuantity = initialCapital / initialPrice;
    totalInvestedAmount = initialCapital;

    dates.push(new Date(startDate));
    investedCapital.push(totalInvestedAmount);
    cryptoQuantity.push(totalCryptoQuantity);
    portfolioValues.push(totalCryptoQuantity * initialPrice);
    prices.push(initialPrice);
  }

  // Monthly additions
  let currentDate = new Date(startDate);
  while (currentDate < endDate) {
    // Move to next month
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    if (currentDate > endDate) break;

    // Use price at this purchase date (or latest available before this date)
    const price = findPriceAtOrBeforeDate(currentDate, historicalPrices);
    if (!price) continue;

    // Add monthly amount
    const quantityBought = monthlyAddition / price;
    totalCryptoQuantity += quantityBought;
    totalInvestedAmount += monthlyAddition;

    // Store data
    dates.push(new Date(currentDate));
    investedCapital.push(totalInvestedAmount);
    cryptoQuantity.push(totalCryptoQuantity);
    portfolioValues.push(totalCryptoQuantity * price);
    prices.push(price);
  }

  // Ensure final portfolio value is measured at endDate
  const endPrice = findPriceAtOrBeforeDate(endDate, historicalPrices);
  if (endPrice !== null && dates.length > 0) {
    const lastIndex = dates.length - 1;
    if (isSameMonthAndYear(dates[lastIndex], endDate)) {
      dates[lastIndex] = new Date(endDate);
      portfolioValues[lastIndex] = totalCryptoQuantity * endPrice;
      prices[lastIndex] = endPrice;
    } else {
      dates.push(new Date(endDate));
      investedCapital.push(totalInvestedAmount);
      cryptoQuantity.push(totalCryptoQuantity);
      portfolioValues.push(totalCryptoQuantity * endPrice);
      prices.push(endPrice);
    }
  }

  return {
    dates,
    portfolioValues,
    investedCapital,
    cryptoQuantity,
    prices,
  };
}

function isSameMonthAndYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function findPriceAtOrBeforeDate(date: Date, prices: PriceData[]): number | null {
  if (prices.length === 0) return null;

  const target = date.getTime();
  let candidate: PriceData | null = null;

  for (const price of prices) {
    if (price.timestamp <= target) {
      candidate = price;
      continue;
    }
    break;
  }

  // If no earlier price exists in range, use first available price after target date.
  if (!candidate) {
    return prices[0].price;
  }

  return candidate.price;
}

export function prepareChartData(
  dates: Date[],
  portfolioValues: number[],
  investedCapital: number[]
): ChartDataPoint[] {
  return dates.map((date, index) => ({
    date: date.toLocaleDateString('fr-FR', { year: '2-digit', month: '2-digit' }),
    portfolioValue: Math.round(portfolioValues[index] * 100) / 100,
    investedCapital: Math.round(investedCapital[index] * 100) / 100,
  }));
}

export function calculateMetrics(
  totalInvested: number,
  finalValue: number
): CalculationResult {
  const roi = finalValue - totalInvested;
  const roiPercentage = totalInvested > 0 ? (roi / totalInvested) * 100 : 0;

  return {
    totalInvested,
    finalValue,
    roi,
    roiPercentage,
    chartData: [],
  };
}
