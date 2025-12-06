'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { isValidAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ContractInputProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export function ContractInput({ onSearch, isLoading }: ContractInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      setError('Please enter a contract address');
      toast.error('Please enter a contract address');
      return;
    }

    if (!isValidAddress(trimmedAddress)) {
      setError('Invalid address format');
      toast.error('Invalid Ethereum/Rootstock address format');
      return;
    }

    onSearch(trimmedAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError('');
            }}
            placeholder="Enter Contract Address (0x...)"
            className={`w-full px-4 py-3 rounded-lg border ${
              error
                ? 'border-destructive focus:border-destructive'
                : 'border-input focus:border-primary'
            } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Inspect
            </>
          )}
        </button>
      </div>
    </form>
  );
}

