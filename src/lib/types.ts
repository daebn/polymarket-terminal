// Polymarket 마켓 하나의 구조
export interface Market {
  id: string;
  question: string;
  outcomePrices: string;     // JSON 문자열: "[\"0.62\", \"0.38\"]"
  outcomes: string;          // JSON 문자열: "[\"Yes\", \"No\"]"
  volume: string;
  active: boolean;
}

// Polymarket 이벤트 (경기) 하나의 구조
export interface MarketEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  liquidity: string;
  volume: string;
  markets: Market[];
}

// 파싱된 오즈 (화면에 표시할 형태)
export interface ParsedOdds {
  outcome: string;
  price: number;
  prevPrice?: number;
  change?: number;
}