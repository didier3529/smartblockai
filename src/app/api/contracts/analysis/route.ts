import { NextResponse } from "next/server"
import { getContractAnalysis, analyzeContract } from "@/lib/services/contract-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const address = searchParams.get("address")
    
    if (address) {
      const data = await analyzeContract(address)
      return NextResponse.json(data)
    }
    
    const data = await getContractAnalysis(filter)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Contract Analysis API Error:", error)
    return NextResponse.json(
      { error: "Failed to analyze contract" },
      { status: 500 }
    )
  }
}