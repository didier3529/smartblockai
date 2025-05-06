# SmartBlockAI

AI-Powered Blockchain Analytics Platform

## Overview

SmartBlockAI is a modern web application that provides real-time blockchain analytics and insights using artificial intelligence. The platform offers features for portfolio tracking, market trend analysis, smart contract security monitoring, and NFT market analytics.

## Features

- Real-time portfolio tracking with historical performance
- Market trends analysis with sentiment indicators
- Smart contract security monitoring and risk assessment
- NFT market analytics and collection tracking
- WebSocket integration for live data updates
- React Query for efficient data fetching and caching

## Tech Stack

- Next.js 14
- TypeScript
- React Query
- WebSocket (ws)
- Ethers.js
- TailwindCSS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/didier3529/smartblockai.git
   cd smartblockai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js app directory
├── lib/
│   ├── hooks/        # Custom React hooks
│   ├── providers/    # React context providers
│   └── services/     # API and blockchain services
└── server/           # Custom server with WebSocket support
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.