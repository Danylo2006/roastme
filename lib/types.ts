export interface Transaction {
  amount: number;
  merchant: string;
  timestamp: string;
  category: string;
}

export interface Regret {
  transaction: Transaction;
  roast: string;
  regretStat?: string;
  timestamp: string;
}
