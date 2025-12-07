'use client';

import { useState, useEffect } from 'react';
import { X, FileCode } from 'lucide-react';
import { isValidAddress } from '@/lib/utils';

interface ContractVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (address: string) => void;
  isLoading?: boolean;
}

export function ContractVerificationModal({
  isOpen,
  onClose,
  onVerify,
  isLoading = false,
}: ContractVerificationModalProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAddress('');
      setError('');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleVerify = () => {
    setError('');

    // Clean and normalize the address
    const trimmedAddress = address.trim();

    console.log('=== Validation Debug ===');
    console.log('Raw address:', address);
    console.log('Trimmed address:', trimmedAddress);
    console.log('Address length:', trimmedAddress.length);
    console.log('Address type:', typeof trimmedAddress);

    if (!trimmedAddress) {
      setError('Please enter a contract address');
      return;
    }

    // Validate before converting to lowercase
    const isValid = isValidAddress(trimmedAddress);
    console.log('isValidAddress result:', isValid);
    console.log('Regex test:', /^0x[a-fA-F0-9]{40}$/.test(trimmedAddress));
    
    if (!isValid) {
      console.error('Validation failed!');
      console.error('Address:', trimmedAddress);
      console.error('Length:', trimmedAddress.length);
      setError('Invalid address format');
      return;
    }

    // Normalize to lowercase for backend consistency
    const normalizedAddress = trimmedAddress.toLowerCase();
    console.log('Normalized address:', normalizedAddress);
    onVerify(normalizedAddress);
  };

  const handleNotNow = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleNotNow}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleNotNow}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
            <FileCode className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black text-center mb-3">
          Contract Inspection, Only If You Need It
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
          Enter a Rootstock contract address to inspect its storage slots and variables.
        </p>

        {/* Address Input */}
        <div className="mb-6">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              const value = e.target.value;
              setAddress(value);
              setError('');
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text').trim();
              console.log('Pasted text:', pastedText);
              console.log('Pasted length:', pastedText.length);
              if (pastedText && pastedText.startsWith('0x')) {
                setAddress(pastedText);
                setError('');
              }
            }}
            placeholder="Paste Contract Address (0x...)"
            className={`w-full px-4 py-3 rounded-lg border ${
              error
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-orange-500'
            } bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all`}
            disabled={isLoading}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={isLoading || !address.trim()}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Inspecting...
              </>
            ) : (
              'Inspect Now'
            )}
          </button>

          <button
            onClick={handleNotNow}
            className="w-full py-2 text-black underline text-sm hover:text-gray-700 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

