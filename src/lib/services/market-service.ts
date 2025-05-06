export interface MarketTrends {
  overview: MarketOverview
  topMovers: TokenData[]
  trends: TrendData[]
}

export interface MarketOverview {
  totalMarketCap: number
  volume24h: number
  btcDominance: number
  marketSentiment: number // 0-100 scale
}

export interface TokenData {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
}

export interface TrendData {
  name: string
  description: string
  sentiment: number // -1 to 1 scale
  relatedTokens: string[]
  sources: string[]
}

// Mock data for development
const mockMarketTrends: MarketTrends = {
  overview: {
    totalMarketCap: 2100000000000,
    volume24h: 85000000000,
    btcDominance: 45.2,
    marketSentiment: 65
  },
  topMovers: [
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 1500,
      change24h: 5.8,
      volume24h: 15000000000
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 45,
      change24h: 12.5,
      volume24h: 2500000000
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      price: 8,
      change24h: -3.2,
      volume24h: 500000000
    }
  ],
  trends: [
    {
      name: "DeFi Growth",
      description: "Increasing adoption of decentralized finance protocols",
      sentiment: 0.8,
      relatedTokens: ["UNI", "AAVE", "MKR"],
      sources: ["DefiLlama", "DappRadar"]
    },
    {
      name: "Layer 2 Scaling",
      description: "Rising transaction volumes on Ethereum L2 solutions",
      sentiment: 0.9,
      relatedTokens: ["OP", "ARB", "MATIC"],
      sources: ["L2Beat", "Dune Analytics"]
    }
  ]
}

export async function getMarketTrends(timeframe: string = "1d"): Promise<MarketTrends> {
  // TODO: Replace with real market data API integration
  return mockMarketTrends
}

export async function getTokenPrice(symbol: string): Promise<number> {
  // TODO: Implement real price fetching
  const mockPrices: { [key: string]: number } = {
    ETH: 1500,
    SOL: 45,
    LINK: 8
  }
  return mockPrices[symbol] || 0
}

export async function getMarketSentiment(): Promise<number> {
  // TODO: Implement real sentiment analysis
  return mockMarketTrends.overview.marketSentiment
}