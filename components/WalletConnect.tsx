'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  return (
    <div className="fixed top-4 right-4">
      <ConnectButton />
    </div>
  );
}
