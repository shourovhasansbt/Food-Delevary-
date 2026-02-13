
import React from 'react';
import { TrendingUp, Wallet, ArrowDownCircle, Coins } from 'lucide-react';

interface SummaryCardsProps {
  totals: {
    earnings: number;
    collections: number;
    expenseTotal: number;
    netProfit: number;
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">EARNINGS</span>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Gross Earnings</p>
        <p className="text-2xl font-bold text-slate-800">৳{totals.earnings.toLocaleString()}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">CASH ON HAND</span>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Collections</p>
        <p className="text-2xl font-bold text-slate-800">৳{totals.collections.toLocaleString()}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">EXPENSES</span>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Costs</p>
        <p className="text-2xl font-bold text-slate-800">৳{totals.expenseTotal.toLocaleString()}</p>
      </div>

      <div className="bg-[#FF5C00] p-5 rounded-2xl shadow-lg border border-[#FF5C00]/20 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white bg-white/2