import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";

import Navbar from "../components/Navbar";

import { getCurrentUser } from "../services/authService";

import {
  addTransaction,
  getTransactions,
} from "../services/transactionService";

import type {
  Transaction,
  TransactionFilters,
  TransactionType,
} from "../types/transaction";

const Home = () => {
  const user = getCurrentUser();

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);

  // =========================
  // FORM
  // =========================

  const [type, setType] = useState<TransactionType>("expense");

  const [description, setDescription] = useState("");

  const [amount, setAmount] = useState("");

  // =========================
  // FILTERS
  // =========================

  const [filterType, setFilterType] = useState<TransactionType | "">("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [minAmount, setMinAmount] = useState("");

  const [maxAmount, setMaxAmount] = useState("");

  const [sort, setSort] = useState<"date" | "amount" | "type">("date");

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalTransactions, setTotalTransactions] = useState(0);

  // =========================
  // UI
  // =========================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // LOAD TRANSACTIONS
  // =========================

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters: TransactionFilters = {
        type: filterType,
        from: fromDate,
        to: toDate,
        minAmount,
        maxAmount,
        sort,
        order,
        page: currentPage,
        limit: 8,
      };

      const data = await getTransactions(filters);

      setTransactions(data.transactions);

      setTotalPages(data.pagination.totalPages);

      setTotalTransactions(data.pagination.totalTransactions);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [
    filterType,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    sort,
    order,
    currentPage,
  ]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // =========================
  // ADD TRANSACTION
  // =========================

  const handleAddTransaction = async () => {
    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("Please enter a description.");

      return;
    }

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");

      return;
    }

    try {
      setAdding(true);

      await addTransaction(type, description.trim(), numericAmount);

      setDescription("");
      setAmount("");

      setCurrentPage(1);

      setSuccess("Transaction added successfully.");

      await loadTransactions();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to add transaction.");
    } finally {
      setAdding(false);
    }
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setFilterType("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");

    setSort("date");
    setOrder("desc");

    setCurrentPage(1);
  };

  // =========================
  // SUMMARY
  // =========================

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Hello, {user?.username || "User"}{" "}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of your income and expenses.
          </p>
        </div>

        {/* =========================
            ALERTS
        ========================== */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button onClick={() => setError("")} className="font-semibold">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* =========================
            SUMMARY CARDS
        ========================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Income */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Income</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(summary.income)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3">
                <ArrowUpRight size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Expenses */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Expenses</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(summary.expenses)}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3">
                <ArrowDownLeft size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Balance */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Balance</p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(summary.balance)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3">
                <Wallet size={22} className="text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            ADD TRANSACTION
        ========================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Add Transaction
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record your income or expense.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Type */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as TransactionType)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="expense">Expense</option>

                <option value="income">Income</option>
              </select>
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Grocery shopping"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* Amount */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount
              </label>

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="₹ 0"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleAddTransaction}
              disabled={adding}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {adding ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </div>

        {/* =========================
            TRANSACTIONS
        ========================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}

          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Transactions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {totalTransactions} total transactions
                </p>
              </div>

              <button
                onClick={loadTransactions}
                className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {/* Filters */}

            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Filter size={16} />
                Filters
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {/* Type */}

                <select
                  value={filterType}
                  onChange={(event) => {
                    setFilterType(event.target.value as TransactionType | "");
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                >
                  <option value="">All Types</option>

                  <option value="income">Income</option>

                  <option value="expense">Expense</option>
                </select>

                {/* From */}

                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />

                {/* To */}

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />

                {/* Min */}

                <input
                  type="number"
                  min="0"
                  placeholder="Min amount"
                  value={minAmount}
                  onChange={(event) => {
                    setMinAmount(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />

                {/* Max */}

                <input
                  type="number"
                  min="0"
                  placeholder="Max amount"
                  value={maxAmount}
                  onChange={(event) => {
                    setMaxAmount(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />

                {/* Clear */}

                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>

              {/* Sorting */}

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as "date" | "amount" | "type");
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option value="date">Sort by Date</option>

                  <option value="amount">Sort by Amount</option>

                  <option value="type">Sort by Type</option>
                </select>

                <select
                  value={order}
                  onChange={(event) => {
                    setOrder(event.target.value as "asc" | "desc");
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option value="desc">Descending</option>

                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading transactions...
                      </p>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Wallet size={32} className="mx-auto text-slate-300" />

                      <p className="mt-3 font-medium text-slate-700">
                        No transactions found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add your first transaction above.
                      </p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        {transaction.type === "income" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <ArrowUpRight size={14} />
                            Income
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            <ArrowDownLeft size={14} />
                            Expense
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {transaction.description}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            transaction.type === "income"
                              ? "font-semibold text-emerald-600"
                              : "font-semibold text-red-600"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-medium text-slate-700">{currentPage}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
