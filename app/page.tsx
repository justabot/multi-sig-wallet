import React from 'react';
import WalletConnect from '../components/WalletConnect';
import MultiSigWallet from '../components/MultiSigWallet';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">MultiSig Wallet</h1>
          <WalletConnect />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <MultiSigWallet />
      </main>
    </div>
  );
} 