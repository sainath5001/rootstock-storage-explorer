'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ContractInput } from '@/components/contract-input';
import { ContractVerificationModal } from '@/components/contract-verification-modal';
import { SlotView } from '@/components/slot-view';
import { VariableView } from '@/components/variable-view';
import { useStorage } from '@/hooks/useStorage';
import { formatAddress } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Loader2, AlertCircle, Info, FileCode } from 'lucide-react';

type ViewTab = 'slots' | 'variables';

export default function Home() {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('slots');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useStorage(contractAddress);

  const handleSearch = (address: string) => {
    setContractAddress(address);
    setActiveTab('slots');
    setIsModalOpen(false);
  };

  const handleVerify = (address: string) => {
    handleSearch(address);
  };

  const handleError = () => {
    if (error) {
      toast.error(error.message || 'Failed to fetch storage data');
    }
  };

  if (error) {
    handleError();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Smart Contract Storage Explorer</h2>
          <p className="text-muted-foreground mb-6">
            Enter a Rootstock contract address to inspect its storage slots and variables
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FileCode className="w-5 h-5" />
              Inspect Contract
            </button>
          </div>
        </div>

        {/* Contract Verification Modal */}
        <ContractVerificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onVerify={handleVerify}
          isLoading={isLoading}
        />

        {/* Results Section */}
        {contractAddress && (
          <div className="mt-8">
            {/* Contract Info */}
            {data && (
              <div className="mb-6 p-4 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Contract Address</h3>
                      {data.isProxy && (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                          Proxy Contract
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm break-all">{data.address}</p>
                    {data.isProxy && data.implementationAddress && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Implementation Address:
                        </p>
                        <p className="font-mono text-xs break-all">
                          {data.implementationAddress}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {data.abiSource && (
                      <span className="text-xs text-muted-foreground">
                        ABI: {data.abiSource}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Analyzing contract storage... This may take a moment.
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-1">
                      Error Loading Storage
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {error.message || 'An error occurred while fetching storage data.'}
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Tabs */}
            {data && !isLoading && !error && (
              <div className="mt-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-border mb-6">
                  <button
                    onClick={() => setActiveTab('slots')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'slots'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Slot-By-Slot View
                    <span className="ml-2 text-xs">
                      ({data.slotView.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('variables')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'variables'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Variable Inspector
                    <span className="ml-2 text-xs">
                      ({data.variableView.length})
                    </span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'slots' && (
                    <SlotView data={data.slotView} />
                  )}
                  {activeTab === 'variables' && (
                    <VariableView data={data.variableView} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State / Instructions */}
        {!contractAddress && !isLoading && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">How to use StateLens</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Enter a Rootstock smart contract address above</li>
                    <li>Click &quot;Inspect&quot; to analyze the contract storage</li>
                    <li>View storage slots in the Slot-By-Slot tab</li>
                    <li>View decoded variables in the Variable Inspector tab</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

