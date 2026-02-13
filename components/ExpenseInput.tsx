
import React, { useState } from 'react';
import { Plus, Banknote } from 'lucide-react';

interface ExpenseInputProps {
  onAdd: (description: string, amount: number) => void;
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (description && !isNaN(numAmount) && numAmount > 0) {
      onAdd(description, numAmount);
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Fuel, Lunch, Mobile Recharge"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-all text-sm"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (BDT)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">৳</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-all text-sm"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseInput;
