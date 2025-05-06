import { NextResponse } from "next/server"
import { getMarketTrends } from "@/lib/services/market-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "1d"
    
    const data = await getMarketTrends(timeframe)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Market Trends API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch market trends" },
      { status: 500 }
    )
  }
}