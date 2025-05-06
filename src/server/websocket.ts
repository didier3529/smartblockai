import { WebSocketServer } from "ws"
import { Server } from "http"
import { getMarketTrends } from "@/lib/services/market-service"
import { getPortfolioData } from "@/lib/services/portfolio-service"
import { getContractAnalysis } from "@/lib/services/contract-service"
import { getNFTMarketData } from "@/lib/services/nft-service"

interface Client {
  ws: WebSocket
  subscriptions: Set<string>
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server })
  const clients = new Map<WebSocket, Client>()
  
  // Set up periodic data updates
  const updateIntervals = new Map<string, NodeJS.Timeout>()
  
  wss.on("connection", (ws) => {
    console.log("Client connected")
    clients.set(ws, { ws, subscriptions: new Set() })

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString())
        const client = clients.get(ws)

        if (!client) return

        switch (data.type) {
          case "subscribe":
            handleSubscribe(client, data.channel)
            break
          case "unsubscribe":
            handleUnsubscribe(client, data.channel)
            break
          default:
            console.warn("Unknown message type:", data.type)
        }
      } catch (error) {
        console.error("Error processing message:", error)
      }
    })

    ws.on("close", () => {
      console.log("Client disconnected")
      const client = clients.get(ws)
      if (client) {
        client.subscriptions.forEach((channel) => {
          handleUnsubscribe(client, channel)
        })
      }
      clients.delete(ws)
    })
  })

  async function handleSubscribe(client: Client, channel: string) {
    client.subscriptions.add(channel)
    
    // If this is the first subscriber, start the update interval
    if (getSubscriberCount(channel) === 1) {
      startUpdateInterval(channel)
    }
    
    // Send initial data
    const data = await getChannelData(channel)
    sendToClient(client, channel, data)
  }

  function handleUnsubscribe(client: Client, channel: string) {
    client.subscriptions.delete(channel)
    
    // If this was the last subscriber, clear the update interval
    if (getSubscriberCount(channel) === 0) {
      const interval = updateIntervals.get(channel)
      if (interval) {
        clearInterval(interval)
        updateIntervals.delete(channel)
      }
    }
  }

  function getSubscriberCount(channel: string): number {
    let count = 0
    for (const client of clients.values()) {
      if (client.subscriptions.has(channel)) {
        count++
      }
    }
    return count
  }

  function startUpdateInterval(channel: string) {
    // Different update frequencies for different data types
    const updateFrequency = {
      "portfolio": 30000, // 30 seconds
      "market-trends": 60000, // 1 minute
      "contract-analysis": 300000, // 5 minutes
      "nft-market": 300000, // 5 minutes
    }[channel] || 60000 // Default to 1 minute

    const interval = setInterval(async () => {
      try {
        const data = await getChannelData(channel)
        broadcastToChannel(channel, data)
      } catch (error) {
        console.error(`Error updating ${channel} data:`, error)
      }
    }, updateFrequency)

    updateIntervals.set(channel, interval)
  }

  async function getChannelData(channel: string) {
    switch (channel) {
      case "portfolio":
        return await getPortfolioData("1d")
      case "market-trends":
        return await getMarketTrends("1d")
      case "contract-analysis":
        return await getContractAnalysis("monitored")
      case "nft-market":
        return await getNFTMarketData("1d")
      default:
        throw new Error(`Unknown channel: ${channel}`)
    }
  }

  function broadcastToChannel(channel: string, data: any) {
    for (const client of clients.values()) {
      if (client.subscriptions.has(channel)) {
        sendToClient(client, channel, data)
      }
    }
  }

  function sendToClient(client: Client, channel: string, data: any) {
    client.ws.send(JSON.stringify({
      channel,
      payload: data,
    }))
  }

  // Cleanup intervals on server shutdown
  process.on("SIGTERM", cleanup)
  process.on("SIGINT", cleanup)

  function cleanup() {
    for (const interval of updateIntervals.values()) {
      clearInterval(interval)
    }
    wss.close()
  }
}