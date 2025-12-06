# Rootstock StateLens Frontend

Beautiful, modern frontend for **Rootstock StateLens** - A Visual Smart Contract Storage Explorer.

## Features

- 🔍 **Contract Address Input**: Easy-to-use search interface
- 📊 **Slot-By-Slot View**: Interactive Ag-Grid table showing all storage slots
- 🎯 **Variable Inspector**: Clean card-based UI showing decoded variables
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📋 **Copy to Clipboard**: One-click copy for addresses and values
- ⚡ **Fast & Responsive**: Built with Next.js 14 and optimized performance
- 🎨 **Modern UI**: Beautiful TailwindCSS design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Data Grid**: Ag-Grid React
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend server running (see backend README)

## Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

4. Configure the backend URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # React Query and theme providers
│   └── globals.css         # Global styles
├── components/
│   ├── header.tsx          # App header with theme toggle
│   ├── contract-input.tsx  # Address input form
│   ├── slot-view.tsx       # Ag-Grid slot table
│   ├── variable-view.tsx   # Variable inspector cards
│   ├── copy-button.tsx     # Copy to clipboard button
│   └── theme-provider.tsx  # Theme context provider
├── hooks/
│   └── useStorage.ts       # React Query hook for storage API
├── services/
│   ├── api.ts              # API service functions
│   └── axios.ts            # Axios client configuration
├── types/
│   └── index.ts            # TypeScript type definitions
└── lib/
    └── utils.ts            # Utility functions
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

## Features Overview

### Slot-By-Slot View

- Interactive Ag-Grid table with sorting and filtering
- Shows slot number, raw hex value, decoded type, and decoded value
- Copy buttons for easy data extraction
- Pagination for large datasets

### Variable Inspector

- Card-based layout showing all decoded variables
- Variable name, type, and current value
- Slot number reference
- Copy functionality

### Error Handling

- User-friendly error messages
- Retry functionality
- Toast notifications for actions

## Development

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- TailwindCSS for styling

### Adding New Features

1. Create components in `components/`
2. Add API calls in `services/api.ts`
3. Create hooks in `hooks/` if needed
4. Update types in `types/index.ts`

## Troubleshooting

### Backend Connection Issues

- Verify the backend is running on the configured port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured in the backend

### Build Errors

- Clear `.next` directory and rebuild
- Check Node.js version (18+ required)
- Verify all dependencies are installed

## License

MIT

