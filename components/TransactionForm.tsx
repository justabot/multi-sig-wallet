'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface TransactionFormProps {
  onSubmit: (to: string, value: string, data: string) => Promise<void>;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('0x');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(to, value, data);
      setTo('');
      setValue('');
      setData('0x');
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Submit New Transaction</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">To Address</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Value (ETH)</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="0.0"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit Transaction
      </button>
    </form>
  );
} 