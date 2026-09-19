import api from "./api";

import type {
  Transaction,
  TransactionFilters,
  TransactionResponse,
} from "../types/transaction";

export const addTransaction = async (
  type: "income" | "expense",
  description: string,
  amount: number,
): Promise<Transaction> => {
  const response = await api.post<{
    message: string;
    transaction: Transaction;
  }>("/transactions", {
    type,
    description,
    amount,
  });

  return response.data.transaction;
};

export const getTransactions = async (
  filters: TransactionFilters = {},
): Promise<TransactionResponse> => {
  const params = new URLSearchParams();

  if (filters.type) {
    params.append("type", filters.type);
  }

  if (filters.from) {
    params.append("from", filters.from);
  }

  if (filters.to) {
    params.append("to", filters.to);
  }

  if (filters.minAmount) {
    params.append("minAmount", filters.minAmount);
  }

  if (filters.maxAmount) {
    params.append("maxAmount", filters.maxAmount);
  }

  params.append("sort", filters.sort || "date");

  params.append("order", filters.order || "desc");

  params.append("page", String(filters.page || 1));

  params.append("limit", String(filters.limit || 10));

  const response = await api.get<TransactionResponse>(
    `/transactions?${params.toString()}`,
  );

  return response.data;
};
