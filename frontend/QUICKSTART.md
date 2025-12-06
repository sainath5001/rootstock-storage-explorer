# Frontend Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
cp env.example.txt .env.local
```

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important**: Make sure your backend is running on port 3001 (or update the URL accordingly).

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Contract Address**: Paste a Rootstock smart contract address in the input box
2. **Click Inspect**: The app will fetch and decode storage slots
3. **View Results**: 
   - Switch between "Slot-By-Slot View" and "Variable Inspector" tabs
   - Copy values using the copy button
   - Toggle dark/light mode in the header

## Features

- ✅ Interactive storage slot table (Ag-Grid)
- ✅ Variable inspector with cards
- ✅ Dark mode support
- ✅ Copy to clipboard
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## Troubleshooting

### Backend Connection Error

- Ensure backend is running: `cd ../backend && npm run dev`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify backend CORS allows `http://localhost:3000`

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Port Already in Use

- Change port: `npm run dev -- -p 3001`
- Or stop the process using port 3000

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the UI colors in `tailwind.config.ts`
- Add more features as needed

