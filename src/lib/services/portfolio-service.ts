import { ethers } from "ethers"

export interface PortfolioData {
  totalValue: number
  tokens: TokenBalance[]
  historicalData: HistoricalDataPoint[]
}

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  value: number
  price: number
  change24h: number
}

export interface HistoricalDataPoint {
  timestamp: number
  value: number
}

// Mock data for development
const mockPortfolioData: PortfolioData = {
  totalValue: 25000,
  tokens: [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "10.5",
      value: 15000,
      price: 1500,
      change24h: 2.5
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      balance: "1000",
      value: 8000,
      price: 8,
      change24h: -1.2
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      balance: "500",
      value: 2000,
      price: 4,
      change24h: 5.8
    }
  ],
  historicalData: Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
    value: 20000 + Math.random() * 10000
  }))
}

export async function getPortfolioData(timeframe: string = "1d"): Promise<PortfolioData> {
  // TODO: Replace with real blockchain data fetching
  return mockPortfolioData
}

export async function getTokenBalance(address: string, tokenAddress: string): Promise<string> {
  // TODO: Implement real token balance checking
  return ethers.parseEther("10.5").toString()
}

export async function getHistoricalPortfolioValue(
  address: string,
  timeframe: string
): Promise<HistoricalDataPoint[]> {
  // TODO: Implement real historical data fetching
  return mockPortfolioData.historicalData
}