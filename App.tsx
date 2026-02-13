
import React, { useState, useCallback, useMemo } from 'react';
import { 
  FileUp, 
  Trash2, 
  Plus, 
  Wallet, 
  TrendingUp, 
  ArrowDownCircle, 
  Calculator,
  LayoutDashboard,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { Transaction, Expense, TransactionType } from './types';
import { extractTransactions } from './services/geminiService';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';
import ExpenseInput from './components/ExpenseInput';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const extracted = await extractTransactions({
          data: base64Data,
          mimeType: file.type
        });
        setTransactions(prev => [...prev, ...extracted]);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addExpense = (description: string, amount: number) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setTransactions([]);
      setExpenses([]);
    }
  };

  const totals = useMemo(() => {
    const earnings = transactions
      .filter(t => t.type === TransactionType.DELIVERY_CHARGE)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const collections = transactions
      .filter(t => t.type === TransactionType.COLLECTION)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenseTotal = expenses.reduce((acc, e) => acc + e.amount, 0);
    
    return {
      earnings,
      collections,
      expenseTotal,
      netProfit: earnings - expenseTotal
    };
  }, [transactions, expenses]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#FF5C00] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">Foodi Smart Ledger AI</h1>
          </div>
          <button 
            onClick={clearAll}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Track Your Hustle</h2>
            <p className="text-slate-500">Upload screenshots of your Foodi transactions to automatically log earnings.</p>
          </div>
          
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isLoading}
            />
            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all ${isLoading ? 'bg-slate-200 text-slate-400' : 'bg-[#FF5C00] text-white group-hover:bg-[#e65200] group-hover:scale-105'}`}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
                  Processing...
                </div>
              ) : (
                <>
                  <FileUp className="w-5 h-5" />
                  Upload Statement
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Dashboard Summary */}
        <SummaryCards totals={totals} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#FF5C00]" />
                <h3 className="font-bold text-slate-700">Recent Transactions</h3>
              </div>
              <TransactionTable transactions={transactions} onRemove={removeTransaction} />
            </div>
          </div>

          {/* Sidebar: Expenses & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-700">Log Daily Expenses</h3>
              </div>
              <div className="p-4">
                <ExpenseInput onAdd={addExpense} />
                
                {expenses.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense List</h4>
                    {expenses.map(exp => (
                      <div key={exp.id} className="flex justify-between items-center group bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{exp.description}</p>
                          <p className="text-xs text-slate-500">৳{exp.amount}</p>
                        </div>
                        <button 
                          onClick={() => removeExpense(exp.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Clear, well-lit screenshots of your weekly statements work best. You can also paste text logs directly into the manual entry if needed.
                </p>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#FF5C00]/10 rounded-full" />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} Foodi Smart Ledger AI • Built for Riders</p>
      </footer>
    </div>
  );
};

export default App;
