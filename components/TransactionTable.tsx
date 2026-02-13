
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Trash2, Calendar, Hash, Banknote } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onRemove }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Banknote className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-slate-700 font-semibold text-lg">No transactions yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Upload a screenshot or text log to see your earnings broken down here.</p>
      </div>
    );
  }

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.COLLECTION:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-tight">Collection</span>;
      case TransactionType.DELIVERY_CHARGE:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-tight">Earning</span>;
      case TransactionType.PAYMENT:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-tight">Payment</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-tight">Other</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 font-bold"><div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> Date</div></th>
            <th className="px-6 py-4 font-bold">Type</th>
            <th className="px-6 py-4 font-bold"><div className="flex items-center gap-2"><Hash className="w-3.5 h-3.5"/> ID</div></th>
            <th className="px-6 py-4 font-bold text-right">Amount (৳)</th>
            <th className="px-6 py-4 font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t, idx) => (
            <tr key={`${t.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700">{t.date}</p>
              </td>
              <td className="px-6 py-4">
                {getTypeBadge(t.type)}
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-mono text-slate-400">{t.id}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <p className={`text-sm font-bold ${t.type === TransactionType.DELIVERY_CHARGE ? 'text-green-600' : 'text-slate-800'}`}>
                  ৳{t.amount.toLocaleString()}
                </p>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onRemove(t.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
