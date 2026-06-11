"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowLeftRight, ChevronLeft, ChevronRight, Filter } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useTransactionsStore } from "@/stores/transactions-store";
import type { Transaction, PaginatedResponse } from "@/types";

const TYPE_ICON = {
  deposit: TrendingUp,
  withdrawal: TrendingDown,
  transfer: ArrowLeftRight,
};

const TYPE_COLOR = {
  deposit: "text-green-700 bg-green-100",
  withdrawal: "text-red-700 bg-red-100",
  transfer: "text-blue-700 bg-blue-100",
};

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const {
    transactions,
    total,
    page,
    totalPages,
    filters,
    isLoading,
    error,
    setTransactions,
    setFilters,
    setPage,
    setLoading,
    setError,
  } = useTransactionsStore();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== "all") params.set("type", filters.type);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      params.set("page", String(filters.page ?? 1));
      params.set("limit", String(filters.limit ?? 10));

      const res = await apiClient.get<PaginatedResponse<Transaction>>(
        `/transactions?${params.toString()}`
      );
      setTransactions({ transactions: res.data, total: res.total, totalPages: res.totalPages });
    } catch {
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, setTransactions, setLoading, setError]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
          {total > 0 ? `${total} transaction${total !== 1 ? "s" : ""}` : "Your transaction history"}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="filter-type" className="text-xs">Type</Label>
              <Select
                value={filters.type ?? "all"}
                onValueChange={(v) => setFilters({ type: v as Transaction["type"] | "all" })}
              >
                <SelectTrigger id="filter-type" className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="filter-sort" className="text-xs">Sort by</Label>
              <Select
                value={filters.sortBy ?? "date"}
                onValueChange={(v) => setFilters({ sortBy: v as "date" | "amount" })}
              >
                <SelectTrigger id="filter-sort" className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="filter-from" className="text-xs">From date</Label>
              <Input
                id="filter-from"
                type="date"
                className="h-9 text-sm"
                value={filters.dateFrom ?? ""}
                onChange={(e) => setFilters({ dateFrom: e.target.value || undefined })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="filter-to" className="text-xs">To date</Label>
              <Input
                id="filter-to"
                type="date"
                className="h-9 text-sm"
                value={filters.dateTo ?? ""}
                onChange={(e) => setFilters({ dateTo: e.target.value || undefined })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions list */}
      <Card>
        {error && (
          <div className="flex flex-col items-center gap-3 py-12" role="alert">
            <p className="text-[hsl(var(--destructive))] text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchTransactions}>Retry</Button>
          </div>
        )}

        {!error && (
          <div
            role="list"
            aria-label="Transactions"
            aria-busy={isLoading}
            className="divide-y divide-[hsl(var(--border))]"
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <TransactionRowSkeleton key={i} />)
              : !transactions.length
              ? (
                <div className="flex flex-col items-center gap-2 py-16 text-[hsl(var(--muted-foreground))]">
                  <ArrowLeftRight className="h-8 w-8 opacity-40" aria-hidden="true" />
                  <p className="text-sm">No transactions found</p>
                </div>
              )
              : transactions.map((txn) => {
                  const Icon = TYPE_ICON[txn.type];
                  return (
                    <Link
                      key={txn.id}
                      href={`/dashboard/transactions/${txn.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-[hsl(var(--accent))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--ring))]"
                      role="listitem"
                      aria-label={`View details for ${txn.description}`}
                    >
                      <div
                        className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", TYPE_COLOR[txn.type])}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{txn.description}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {formatDate(txn.date)}
                          {txn.counterparty ? ` · ${txn.counterparty}` : ""}
                          {" · "}
                          <span className="font-mono">{txn.reference}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            txn.type === "deposit" ? "text-green-700" : ""
                          )}
                        >
                          {txn.type === "deposit" ? "+" : "-"}
                          {formatCurrency(txn.amount)}
                        </p>
                        <Badge
                          variant={txn.status === "completed" ? "success" : txn.status === "pending" ? "warning" : "destructive"}
                          className="text-xs mt-0.5"
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--border))]">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
