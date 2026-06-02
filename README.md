# DeFi Price Dashboard dApp

A real-time decentralized price feed dashboard that reads live ETH, BTC, and LINK prices directly from Chainlink oracles on Base Sepolia, logs them on-chain, and indexes the history via The Graph for instant querying.

## Live Demo

> Deploy your own using the setup instructions below.

---

## The Architecture

Standard Web3 dApps poll RPC nodes for price data — slow, rate-limited, and expensive. This dApp uses a hybrid approach:

```
User clicks "Log Latest Price"
        ↓
Smart contract reads Chainlink price feeds
        ↓
Emits PriceLogged(token, price, timestamp) events
        ↓
The Graph subgraph indexes the events in real time
        ↓
Frontend queries subgraph via GraphQL every 8 seconds
        ↓
Dashboard renders live price cards + interactive chart
```

This means the frontend never hammers RPC nodes for historical data — only the current price cards use direct `wagmi` reads.

---

## Features

- **Live Price Cards** — ETH, BTC, LINK pulled directly from Chainlink via on-chain `view` functions, refreshed every 10 seconds
- **Interactive Price Chart** — last 20 logged prices per token with a working hover tooltip, powered by Recharts
- **Recent Events Feed** — chronological log of all on-chain price emissions indexed by The Graph
- **Wallet Integration** — RainbowKit + Wagmi for MetaMask, WalletConnect, Coinbase Wallet, and Rainbow support
- **One-Click Logging** — "Log Latest Price" button writes all three prices on-chain in a single transaction

---

## Tech Stack

### Frontend (On-Chain Interface)

| Technology | Purpose |
|---|---|
| React + Vite | Lightning-fast single-page UI |
| Tailwind CSS | Utility-first styling |
| Wagmi v2 | Ethereum hooks (read/write contracts) |
| RainbowKit v2 | Wallet connection modal |
| Recharts | Price history chart |
| Apollo Client + GraphQL | Subgraph data fetching |

### Blockchain

| Technology | Purpose |
|---|---|
| Solidity ^0.8.20 | Smart contract logic |
| Chainlink AggregatorV3 | Live price feed oracles |
| Base Sepolia (L2) | Low-gas testnet deployment |
| Hardhat | Compile, test, deploy |
| The Graph | On-chain event indexing |

---

## Smart Contract

**Network:** Base Sepolia  
**Contract:** `PriceTracker.sol`

The contract integrates three Chainlink price feed aggregators:

| Feed | Address |
|---|---|
| ETH / USD | `0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1` |
| BTC / USD | `0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298` |
| LINK / USD | `0xb113F5A928BCfF189C998ab20d753a47F9dE5A61` |

### Key Functions

```solidity
// Direct reads for live price cards (called by wagmi useReadContract)
function getLatestETH() public view returns (int256)
function getLatestBTC() public view returns (int256)
function getLatestLINK() public view returns (int256)

// Write function — logs all three prices and emits events
function logLatestPrice() public
```

### Event

```solidity
event PriceLogged(string token, uint256 price, uint256 timestamp);
```

This event is what The Graph subgraph listens to and indexes for the chart and recent events panel.

---

## The Graph Subgraph

Price history is indexed via a custom subgraph deployed on The Graph Studio. The frontend queries:

```graphql
{
  priceRecords(first: 50, orderBy: timestamp, orderDirection: desc) {
    id
    token
    price
    timestamp
  }
}
```

Prices are stored as raw `uint256` (8 decimal places from Chainlink) and divided by `1e8` on the frontend to get the USD value.

---

## Project Structure

```
DeFi Price Dashboard dApp/
├── frontend/                  # React + Vite
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx       # Main layout and data orchestration
│       │   ├── PriceCard.jsx       # Live price via wagmi useReadContract
│       │   ├── PriceChart.jsx      # Recharts line chart with token switcher
│       │   └── TransactionLogs.jsx # Recent on-chain events feed
│       └── constants.js            # Contract address + ABI
```

---

## Run Locally

### Prerequisites

- Node.js 18+
- MetaMask with Base Sepolia testnet added
- Test ETH from the [Base Sepolia faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in `/frontend`:

```env
VITE_CONTRACT_ADDRESS=<your_deployed_contract_address>
```

---

## How It Works End-to-End

1. **Connect Wallet** — RainbowKit handles wallet detection and connection
2. **View Live Prices** — `PriceCard` components call `getLatestETH/BTC/LINK` directly on-chain via `wagmi`, refreshing every 10 seconds
3. **Log a Price** — clicking "Log Latest Price" calls `logLatestPrice()` which reads all three Chainlink feeds and emits `PriceLogged` events
4. **Subgraph Indexes** — The Graph picks up the emitted events and makes them available via GraphQL
5. **Dashboard Updates** — `Dashboard.jsx` polls the subgraph every 8 seconds, feeding fresh data to the chart and events panel

---

## Chainlink Price Feeds

Feed addresses sourced from the official [Chainlink Base Sepolia documentation](https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1#base-testnet-sepolia). All prices follow the standard 8-decimal format used by Chainlink aggregators.

---

## Author

**Huzaifa** — Web3 Full-Stack Engineer
