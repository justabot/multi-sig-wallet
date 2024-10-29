'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          const signerInstance = web3Provider.getSigner();
          
          setAccount(accounts[0]);
          setProvider(web3Provider);
          setSigner(signerInstance);
        } catch (error) {
          console.error('User rejected connection:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    connectWallet();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return { account, provider, signer };
} 