export type TransactionType = "income" | "expense";

export interface Transaction {
  _id: string;
  user: string;
  type: TransactionType;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  transactions: Transaction[];

  pagination: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
  };
}

export interface TransactionFilters {
  type?: TransactionType | "";
  from?: string;
  to?: string;
  minAmount?: string;
  maxAmount?: string;
  sort?: "date" | "amount" | "type";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
