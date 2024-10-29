'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../utils/constants';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function MultiSigWallet() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [isSignatory, setIsSignatory] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const contract = useContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    signerOrProvider: signer
  });

  useEffect(() => {
    if (address && contract) {
      checkIfSignatory();
      loadTransactions();
    }
  }, [address, contract]);

  const checkIfSignatory = async () => {
    if (contract && address) {
      const result = await contract.isSignatory(address);
      setIsSignatory(result);
    }
  };

  const loadTransactions = async () => {
    if (contract) {
      const count = await contract.getTransactionCount();
      const txs = [];
      for (let i = 0; i < count; i++) {
        const tx = await contract.getTransaction(i);
        txs.push({ ...tx, index: i });
      }
      setTransactions(txs);
    }
  };

  const handleSubmitTransaction = async (to: string, value: string, data: string) => {
    try {
      const tx = await contract.submitTransaction(
        to,
        ethers.utils.parseEther(value),
        data
      );
      await tx.wait();
      await loadTransactions();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  const handleConfirmTransaction = async (txIndex: number) => {
    try {
      const tx = await contract.confirmTransaction(txIndex);
      await tx.wait();
      await loadTransactions();
    } catch (error) {
      console.error('Error confirming transaction:', error);
    }
  };

  const handleExecuteTransaction = async (txIndex: number) => {
    try {
      const tx = await contract.executeTransaction(txIndex);
      await tx.wait();
      await loadTransactions();
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  };

  if (!address) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Please connect your wallet to continue</p>
      </div>
    );
  }

  if (!isSignatory) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">You are not a signatory of this wallet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TransactionForm onSubmit={handleSubmitTransaction} />
      <TransactionList
        transactions={transactions}
        onConfirm={handleConfirmTransaction}
        onExecute={handleExecuteTransaction}
      />
    </div>
  );
} 