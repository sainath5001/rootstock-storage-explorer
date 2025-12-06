# Project Structure

## Overview

This backend service is built with a clean, modular architecture following separation of concerns principles.

## Directory Structure

```
backend/
├── src/
│   ├── api/                          # API layer
│   │   └── routes/
│   │       └── storage.routes.ts     # Storage API endpoints
│   │
│   ├── services/                     # Business logic services
│   │   ├── rpc.service.ts           # RPC client wrapper (viem)
│   │   ├── storage.service.ts       # Main storage analysis orchestrator
│   │   ├── abi.service.ts           # ABI fetching and parsing
│   │   ├── proxy.service.ts         # Proxy contract detection (EIP-1967)
│   │   └── cache.service.ts         # In-memory caching
│   │
│   ├── utils/                        # Utility functions
│   │   ├── address.ts               # Address validation and normalization
│   │   ├── slotDecoder.ts           # Storage slot decoding logic
│   │   ├── typeDecoder.ts           # Type-specific decoding
│   │   └── layout.ts                # Storage layout parsing
│   │
│   ├── config/                       # Configuration management
│   │   └── index.ts                 # Environment config with Zod validation
│   │
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                 # Shared types and interfaces
│   │
│   └── index.ts                      # Application entry point
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── jest.config.js                    # Jest test configuration
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── .gitignore                        # Git ignore rules
├── env.example.txt                   # Environment variables template
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
└── PROJECT_STRUCTURE.md              # This file
```

## Key Components

### API Layer (`src/api/routes/`)

- **storage.routes.ts**: Defines all HTTP endpoints
  - `GET /api/storage` - Analyze contract storage
  - `POST /api/storage` - Analyze with custom ABI/layout
  - `POST /api/storage/slots` - Get specific slots
  - `GET /api/health` - Health check

### Services Layer (`src/services/`)

1. **RPCService**: Wraps viem client for blockchain interactions
   - Storage slot reading
   - Batch processing
   - Contract code fetching

2. **StorageService**: Orchestrates storage analysis
   - Coordinates all services
   - Builds slot view and variable view
   - Handles proxy resolution

3. **ABIService**: ABI management
   - Fetches from block explorer
   - Validates ABI structure
   - Extracts variable hints

4. **ProxyService**: Proxy contract detection
   - EIP-1967 pattern detection
   - Implementation address resolution

5. **CacheService**: In-memory caching
   - TTL-based cache
   - Cache key generation

### Utilities (`src/utils/`)

1. **address.ts**: Address utilities
   - Validation
   - Checksum normalization
   - Zero address detection

2. **slotDecoder.ts**: Core decoding logic
   - Auto-type detection
   - Hex to readable conversion
   - Supports uint256, address, bool, string

3. **typeDecoder.ts**: Type-specific decoding
   - Mapping slot calculation
   - Array slot calculation
   - Type-based value formatting

4. **layout.ts**: Storage layout parsing
   - Compiler output parsing
   - Variable-to-slot mapping
   - Layout utilities

## Data Flow

```
Client Request
    ↓
API Route (validation)
    ↓
Storage Service
    ├──→ RPC Service (fetch storage slots)
    ├──→ Proxy Service (detect proxy)
    ├──→ ABI Service (fetch/validate ABI)
    └──→ Slot Decoder (decode values)
    ↓
Response (slotView + variableView)
```

## Technology Choices

- **Fastify**: High-performance HTTP framework
- **viem**: Modern Ethereum/Rootstock interaction library
- **Zod**: Runtime type validation
- **Pino**: Fast JSON logger
- **node-cache**: In-memory caching

## Extension Points

### Adding New Decoders

Add new type decoders in `src/utils/typeDecoder.ts`:

```typescript
if (type === 'yourType') {
  // Decode logic
  return decodedValue;
}
```

### Adding New Services

Create new service in `src/services/`:

```typescript
export class YourService {
  // Service logic
}
```

### Adding New Routes

Add routes in `src/api/routes/storage.routes.ts` or create new route file:

```typescript
export async function yourRoutes(fastify: FastifyInstance) {
  fastify.get('/api/your-route', async (request, reply) => {
    // Route logic
  });
}
```

## Testing

Tests should mirror the source structure:

```
test/
├── services/
├── utils/
└── api/
```

## Configuration

All configuration is managed through:
- Environment variables (`.env`)
- Validated via Zod schema (`src/config/index.ts`)
- Type-safe access throughout the application

## Error Handling

- API routes: Validation errors (400), server errors (500)
- Services: Throw descriptive errors
- Logging: All errors logged via Pino
- Graceful degradation: Missing ABI doesn't fail, uses auto-detection

