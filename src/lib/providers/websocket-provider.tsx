import React, { createContext, useContext, useEffect, useRef, useState } from "react"

interface WebSocketContextType {
  subscribe: (channel: string, callback: (data: any) => void) => () => void
  unsubscribe: (channel: string) => void
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(
    new Map()
  )
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  const connectWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const ws = new WebSocket(`${protocol}//${window.location.host}`)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      
      // Resubscribe to all channels
      subscribersRef.current.forEach((_, channel) => {
        ws.send(JSON.stringify({ type: "subscribe", channel }))
      })
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
      wsRef.current = null

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket()
      }, 5000)
    }

    ws.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data)
        const subscribers = subscribersRef.current.get(channel)
        if (subscribers) {
          subscribers.forEach((callback) => callback(payload))
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
    }

    wsRef.current = ws
  }

  const subscribe = (channel: string, callback: (data: any) => void) => {
    let subscribers = subscribersRef.current.get(channel)
    
    if (!subscribers) {
      subscribers = new Set()
      subscribersRef.current.set(channel, subscribers)
      
      // Send subscribe message if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "subscribe", channel }))
      }
    }
    
    subscribers.add(callback)

    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current.get(channel)
      if (subscribers) {
        subscribers.delete(callback)
        
        if (subscribers.size === 0) {
          subscribersRef.current.delete(channel)
          
          // Send unsubscribe message if connected
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "unsubscribe", channel }))
          }
        }
      }
    }
  }

  const unsubscribe = (channel: string) => {
    subscribersRef.current.delete(channel)
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", channel }))
    }
  }

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

export function useSubscription<T>(channel: string) {
  const { subscribe, isConnected } = useWebSocket()
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const unsubscribe = subscribe(channel, (newData: T) => {
      setData(newData)
    })
    return unsubscribe
  }, [channel, subscribe])

  return { data, isConnected }
}