# Rootstock StateLens Backend

Backend service for **Rootstock StateLens** - A Visual Smart Contract Storage Explorer. This service reads and decodes storage slots from Rootstock smart contracts, making contract state readable and understandable.

## Features

- 🔍 **Storage Slot Crawling**: Automatically reads storage slots from contracts
- 📊 **Smart Decoding**: Decodes raw hex values into readable types (uint256, address, bool, string, etc.)
- 🎯 **ABI Integration**: Uses contract ABIs to map storage slots to variable names
- 🔄 **Proxy Support**: Automatically detects and resolves EIP-1967 proxy contracts
- ⚡ **Caching**: In-memory caching for improved performance
- 🛡️ **Error Handling**: Robust error handling and validation
- 📝 **Health Checks**: Built-in health check endpoint

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Fastify (high-performance HTTP server)
- **RPC Client**: viem (Ethereum/Rootstock interaction)
- **Validation**: Zod
- **Logging**: Pino
- **Caching**: node-cache

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Access to a Rootstock RPC node (archive node recommended)

## Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
RPC_URL=https://public-node.rsk.co
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
CACHE_TTL=300
MAX_STORAGE_SLOTS=500
BATCH_SIZE=50
ROOTSTOCK_EXPLORER_API=https://blockscout.com/rsk/mainnet/api
LOG_LEVEL=info
```

## Running the Server

### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload using `tsx watch`.

### Production Mode

1. Build the project:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

## API Endpoints

### GET `/api/storage?address=<contractAddress>`

Analyzes contract storage and returns both slot view and variable view.

**Query Parameters:**
- `address` (required): Rootstock contract address

**Response:**
```json
{
  "address": "0x...",
  "isProxy": false,
  "slotView": [
    {
      "slot": 0,
      "raw": "0x00000000000000000000000000000000000000000000000186A0",
      "decodedType": "uint256",
      "decodedValue": "100000"
    }
  ],
  "variableView": [
    {
      "name": "supply",
      "type": "uint256",
      "value": "100000",
      "slot": 0
    }
  ],
  "abiSource": "explorer"
}
```

### POST `/api/storage`

Analyzes contract storage with optional ABI and storage layout.

**Request Body:**
```json
{
  "address": "0x...",
  "abi": [...], // Optional: Contract ABI
  "storageLayout": {...}, // Optional: Solidity storage layout
  "maxSlots": 500 // Optional: Maximum slots to read
}
```

### POST `/api/storage/slots`

Gets storage for specific slots only.

**Request Body:**
```json
{
  "address": "0x...",
  "slots": [0, 1, 2, 3]
}
```

### GET `/api/health`

Health check endpoint. Returns server status and RPC connection status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RPC_URL` | Rootstock RPC endpoint | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment (development/production/test) | development |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | http://localhost:3000 |
| `CACHE_TTL` | Cache TTL in seconds | 300 |
| `MAX_STORAGE_SLOTS` | Maximum slots to crawl | 500 |
| `BATCH_SIZE` | Batch size for RPC calls | 50 |
| `ROOTSTOCK_EXPLORER_API` | Block explorer API URL (optional) | - |
| `LOG_LEVEL` | Logging level | info |

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── routes/
│   │       └── storage.routes.ts    # API route handlers
│   ├── services/
│   │   ├── rpc.service.ts           # RPC client service
│   │   ├── storage.service.ts       # Main storage analysis service
│   │   ├── abi.service.ts           # ABI fetching and parsing
│   │   ├── proxy.service.ts         # Proxy contract detection
│   │   └── cache.service.ts         # Caching service
│   ├── utils/
│   │   ├── address.ts               # Address utilities
│   │   ├── slotDecoder.ts           # Storage slot decoding
│   │   ├── typeDecoder.ts           # Type-specific decoding
│   │   └── layout.ts                # Storage layout parsing
│   ├── config/
│   │   └── index.ts                 # Configuration management
│   └── index.ts                     # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Contract Detection**: Validates that the address contains contract code
2. **Proxy Detection**: Checks for EIP-1967 proxy patterns and resolves implementation
3. **Storage Crawling**: Reads storage slots using `eth_getStorageAt` RPC calls
4. **ABI Fetching**: Attempts to fetch contract ABI from block explorer
5. **Decoding**: Decodes raw hex values into readable types
6. **Layout Mapping**: Maps storage slots to variable names using ABI/storage layout
7. **Response**: Returns both low-level (slot view) and high-level (variable view) representations

## Storage Slot Decoding

The service automatically detects and decodes:

- **uint256** / **uint8-uint248**: Integer values
- **int256** / **int8-int248**: Signed integers
- **address**: Ethereum/Rootstock addresses
- **bool**: Boolean values
- **bytes32** / **bytes**: Byte arrays
- **string**: UTF-8 strings (when possible)

## Proxy Contracts

The service automatically detects EIP-1967 proxy contracts:

- Checks implementation slot: `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
- Checks admin slot: `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`
- Resolves implementation address for storage analysis

## Error Handling

The service handles various error scenarios:

- Invalid contract addresses
- Non-contract addresses
- RPC connection failures
- Missing ABIs
- Unverified contracts
- Rate limiting

All errors are logged and returned with appropriate HTTP status codes.

## Performance Considerations

- **Batch Processing**: Storage slots are read in batches to avoid overwhelming the RPC node
- **Caching**: Results are cached in memory for quick subsequent access
- **Rate Limiting**: Small delays between batches to be respectful to RPC nodes
- **Configurable Limits**: Maximum slots and batch sizes can be configured

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Testing

```bash
npm test
```

## Troubleshooting

### RPC Connection Issues

- Verify your `RPC_URL` is correct and accessible
- Check if the RPC node supports `eth_getStorageAt`
- Ensure you're using an archive node for historical data

### Slow Performance

- Increase `BATCH_SIZE` (but be mindful of RPC node limits)
- Decrease `MAX_STORAGE_SLOTS` if you only need recent slots
- Check RPC node latency

### Missing Variable Names

- Provide contract ABI via POST endpoint
- Provide storage layout JSON from Solidity compiler
- Variable names require verified contracts on block explorer

## License

MIT

## Contributing

Contributions are welcome! Please ensure your code follows the existing style and includes appropriate tests.

