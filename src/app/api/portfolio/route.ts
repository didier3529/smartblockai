import { NextResponse } from "next/server"
import { getPortfolioData } from "@/lib/services/portfolio-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "1d"
    
    const data = await getPortfolioData(timeframe)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Portfolio API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    )
  }
}