
export enum TransactionType {
  COLLECTION = 'Collection',
  DELIVERY_CHARGE = 'Delivery Charge',
  PAYMENT = 'Payment',
  OTHER = 'Other'
}

export interface Transaction {
  date: string;
  type: TransactionType;
  id: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
}

export interface LedgerState {
  transactions: Transaction[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}
