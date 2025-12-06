# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to a Rootstock RPC endpoint

## Setup in 5 Minutes

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp env.example.txt .env
```

Edit `.env` with your configuration:

```env
RPC_URL=https://public-node.rsk.co
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Start the Server

**Development mode (with hot reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

### 4. Test the API

**Health Check:**

```bash
curl http://localhost:3001/api/health
```

**Get Storage for a Contract:**

```bash
curl "http://localhost:3001/api/storage?address=0xYourContractAddress"
```

**With specific slots:**

```bash
curl -X POST http://localhost:3001/api/storage/slots \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xYourContractAddress",
    "slots": [0, 1, 2, 3]
  }'
```

## Example Contract Addresses (Rootstock)

Here are some example contracts you can try:

- **RBTC Token**: `0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5`
- **RIF Token**: `0x2acc95758f8b5f583470ba265eb685a8f45fc9d5`

## Common Issues

### RPC Connection Failed

- Check if your `RPC_URL` is correct
- Verify the RPC node is accessible
- Try a different RPC endpoint

### Slow Response Times

- Reduce `MAX_STORAGE_SLOTS` in `.env`
- Increase `BATCH_SIZE` (if RPC node allows)
- Use an archive node for better performance

### No Variable Names

- Provide ABI via POST endpoint
- Use verified contracts on block explorer
- Provide storage layout JSON

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Integrate with the frontend
- Configure caching and optimization settings

