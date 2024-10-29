import WalletConnect from '../components/WalletConnect';
import MultiSigWallet from '../components/MultiSigWallet';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <WalletConnect />
      <main className="pt-20">
        <MultiSigWallet />
      </main>
    </div>
  );
} 