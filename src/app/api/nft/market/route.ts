import { NextResponse } from "next/server"
import { getNFTMarketData, getCollectionData } from "@/lib/services/nft-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "1d"
    const address = searchParams.get("address")
    
    if (address) {
      const data = await getCollectionData(address)
      if (!data) {
        return NextResponse.json(
          { error: "Collection not found" },
          { status: 404 }
        )
      }
      return NextResponse.json(data)
    }
    
    const data = await getNFTMarketData(timeframe)
    return NextResponse.json(data)
  } catch (error) {
    console.error("NFT Market API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch NFT market data" },
      { status: 500 }
    )
  }
}