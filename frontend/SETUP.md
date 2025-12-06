# Frontend Setup Instructions

## Complete Setup Guide

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Ag-Grid
- React Query
- Axios
- And more...

### Step 2: Create Environment File

Create a `.env.local` file in the frontend directory:

```bash
cp env.example.txt .env.local
```

Or manually create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important Notes:**
- Make sure your backend is running on port 3001
- If your backend runs on a different port, update the URL
- For production, set this to your production backend URL

### Step 3: Start Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

### Step 4: Verify Backend Connection

Make sure your backend is running:

```bash
# In a separate terminal
cd ../backend
npm run dev
```

Backend should be on **http://localhost:3001**

## Project Structure Overview

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (main UI)
│   ├── providers.tsx        # React Query + Theme providers
│   └── globals.css          # Global styles + Tailwind
├── components/              # React components
│   ├── header.tsx           # App header with theme toggle
│   ├── contract-input.tsx   # Address input form
│   ├── slot-view.tsx        # Ag-Grid table component
│   ├── variable-view.tsx    # Variable cards component
│   ├── copy-button.tsx      # Copy to clipboard button
│   └── theme-provider.tsx   # Dark mode provider
├── hooks/                   # Custom React hooks
│   └── useStorage.ts        # React Query hook for API
├── services/                # API services
│   ├── api.ts              # API functions
│   └── axios.ts            # Axios client config
├── types/                   # TypeScript types
│   └── index.ts            # Type definitions
└── lib/                     # Utilities
    └── utils.ts            # Helper functions
```

## Features Implemented

✅ **Homepage with Input**
- Beautiful search interface
- Address validation
- Loading states

✅ **Slot-By-Slot View**
- Ag-Grid table with sorting/filtering
- Copy buttons for all values
- Pagination
- Dark mode support

✅ **Variable Inspector**
- Card-based layout
- Clean variable display
- Copy functionality

✅ **Dark Mode**
- Toggle in header
- System preference detection
- Smooth transitions

✅ **Error Handling**
- Toast notifications
- User-friendly error messages
- Retry functionality

✅ **Responsive Design**
- Works on all screen sizes
- Mobile-friendly

## Testing the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**:
   - Go to http://localhost:3000
   - Enter a contract address
   - Click "Inspect"

4. **Try These Features**:
   - Toggle dark/light mode
   - Switch between Slot and Variable tabs
   - Copy values using copy buttons
   - Test with different contract addresses

## Common Issues & Solutions

### Issue: Backend Connection Failed

**Solution:**
- Check backend is running: `curl http://localhost:3001/api/health`
- Verify `.env.local` has correct URL
- Check backend CORS settings allow `http://localhost:3000`

### Issue: Port 3000 Already in Use

**Solution:**
- Use different port: `npm run dev -- -p 3001`
- Or stop the process using port 3000

### Issue: Build Errors

**Solution:**
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node.js version (18+ required)

### Issue: Ag-Grid Styles Not Loading

**Solution:**
- Check imports in `slot-view.tsx`
- Verify CSS files are imported correctly
- Clear browser cache

## Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Environment Variables**:
   - Set `NEXT_PUBLIC_API_URL` to production backend URL
   - Update in `.env.local` or deployment platform

## Additional Notes

- The app uses React Query for caching (5 minute cache)
- Ag-Grid is configured for 50 items per page
- Toast notifications appear for 4 seconds
- All components are fully typed with TypeScript

## Next Steps

- Customize colors in `tailwind.config.ts`
- Add more features as needed
- Deploy to production (Vercel, Netlify, etc.)

