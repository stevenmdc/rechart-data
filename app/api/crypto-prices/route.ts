const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
// Use CryptoCompare API for historical data
const CRYPTOCOMPARE_API_BASE = 'https://min-api.cryptocompare.com/data/v2';
const MAX_DAILY_LIMIT = 2000;
const SECONDS_PER_DAY = 60 * 60 * 24;
const SYMBOL_BY_CRYPTO = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  xrp: 'XRP',
} as const;
const SUPPORTED_CRYPTOS = Object.keys(SYMBOL_BY_CRYPTO) as Array<keyof typeof SYMBOL_BY_CRYPTO>;

interface CryptoCompareCandle {
  time: number;
  close: number;
}

interface CryptoCompareHistodayResponse {
  Response: string;
  Message?: string;
  Data?: {
    Data?: CryptoCompareCandle[];
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const crypto = searchParams.get('crypto');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Validation
    if (!crypto || !from || !to) {
      return Response.json(
        { error: 'Missing required parameters: crypto, from, to' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_CRYPTOS.includes(crypto as keyof typeof SYMBOL_BY_CRYPTO)) {
      return Response.json(
        { error: `Invalid crypto. Must be one of: ${SUPPORTED_CRYPTOS.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate days difference for limit
    const startTimestamp = parseInt(from, 10);
    const endTimestamp = parseInt(to, 10);

    if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
      return Response.json(
        { error: 'Invalid timestamp. from/to must be unix seconds.' },
        { status: 400 }
      );
    }

    // Fetch from CryptoCompare (historical daily data)
    const fsym = SYMBOL_BY_CRYPTO[crypto as keyof typeof SYMBOL_BY_CRYPTO];
    const allPoints: CryptoCompareCandle[] = [];
    let currentEnd = endTimestamp;

    while (currentEnd >= startTimestamp) {
      const remainingDays = Math.floor((currentEnd - startTimestamp) / SECONDS_PER_DAY);
      const limit = Math.min(MAX_DAILY_LIMIT, remainingDays);

      const url = new URL(`${CRYPTOCOMPARE_API_BASE}/histoday`);
      url.searchParams.append('fsym', fsym);
      url.searchParams.append('tsym', 'EUR');
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('aggregate', '1');
      url.searchParams.append('toTs', currentEnd.toString());
      if (API_KEY) {
        url.searchParams.append('api_key', API_KEY);
      }

      console.log('Fetching from URL:', url.toString());

      const response = await fetch(url.toString());
      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CryptoCompare error response:', errorText);
        throw new Error(`CryptoCompare API error: ${response.statusText} - ${errorText}`);
      }

      const data = (await response.json()) as CryptoCompareHistodayResponse;

      if (data.Response !== 'Success') {
        console.error('CryptoCompare API error:', data.Message);
        throw new Error(`CryptoCompare API error: ${data.Message}`);
      }

      const chunk = data.Data?.Data ?? [];
      if (!chunk || chunk.length === 0) {
        break;
      }

      allPoints.push(...chunk);

      const oldest = chunk[0].time;
      const nextEnd = oldest - SECONDS_PER_DAY;
      if (nextEnd >= currentEnd) {
        break;
      }
      currentEnd = nextEnd;
    }

    const priceByTime = new Map<number, number>();
    for (const point of allPoints) {
      if (point.time < startTimestamp || point.time > endTimestamp) {
        continue;
      }
      if (!priceByTime.has(point.time)) {
        priceByTime.set(point.time, point.close);
      }
    }

    const sortedTimes = Array.from(priceByTime.keys()).sort((a, b) => a - b);
    const prices = sortedTimes.map((time) => ({
      timestamp: time * 1000,
      price: priceByTime.get(time) ?? 0,
    }));

    return Response.json(
      { prices, crypto },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API error:', errorMessage);

    // Return more detailed error for debugging
    return Response.json(
      {
        error: 'Failed to fetch crypto prices',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
