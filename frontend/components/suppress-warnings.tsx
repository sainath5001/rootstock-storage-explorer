'use client';

import { useEffect } from 'react';

/**
 * Suppresses harmless warnings from browser extensions
 * (like MetaMask, wallet extensions, etc.)
 */
export function SuppressWarnings() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Filter out extension-related warnings
    const filterExtensionWarnings = (args: any[]) => {
      const message = args[0]?.toString() || '';
      
      // Ignore hydration warnings from extensions
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('data-channel-name') ||
        message.includes('data-extension-id') ||
        message.includes('Error checking default wallet status')
      ) {
        return false; // Don't log
      }
      
      return true; // Log normally
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      if (filterExtensionWarnings(args)) {
        originalWarn.apply(console, args);
      }
    };

    // Override console.error for wallet-related errors
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (message.includes('Error checking default wallet status')) {
        return; // Silently ignore
      }
      originalError.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null; // This component doesn't render anything
}

