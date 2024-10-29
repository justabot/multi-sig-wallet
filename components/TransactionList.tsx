'use client';

import { ethers } from 'ethers';

interface Transaction {
  index: number;
  to: string;
  value: ethers.BigNumber;
  executed: boolean;
  numConfirmations: number;
  proposedAt: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  onConfirm: (txIndex: number) => Promise<void>;
  onExecute: (txIndex: number) => Promise<void>;
}

export default function TransactionList({ transactions, onConfirm, onExecute }: TransactionListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold p-6 border-b">Transactions</h2>
      <div className="divide-y">
        {transactions.map((tx) => (
          <div key={tx.index} className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-mono">{tx.to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p>{ethers.utils.formatEther(tx.value)} ETH</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Confirmations</p>
                <p>{tx.numConfirmations.toString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{tx.executed ? 'Executed' : 'Pending'}</p>
              </div>
            </div>
            {!tx.executed && (
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => onConfirm(tx.index)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onExecute(tx.index)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Execute
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 