"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Transaction } from "@/types";

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

function BackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href="/dashboard/transactions">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to transactions
      </Link>
    </Button>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[hsl(var(--border))] last:border-0">
      <dt className="text-sm text-[hsl(var(--muted-foreground))] shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}

function TransactionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-36" />
      <Card>
        <CardContent className="pt-6 flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between py-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchTransaction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Transaction }>(`/transactions/${id}`);
      setTransaction(res.data);
    } catch (err: unknown) {
      const e = err as { message?: string; status?: number };
      setIsNotFound(e?.status === 404);
      setError(
        e?.status === 404
          ? "Transaction not found."
          : "Failed to load transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTransaction();
  }, [id]);

  if (isLoading) return <TransactionDetailSkeleton />;

  return (
    <div className="space-y-6 page-enter">
      <BackButton />

      {error ? (
        <div className="flex flex-col items-center gap-3 py-16" role="alert">
          <p className="text-[hsl(var(--destructive))] text-sm">{error}</p>
          {!isNotFound && (
            <Button variant="outline" size="sm" onClick={fetchTransaction}>
              Retry
            </Button>
          )}
        </div>
      ) : transaction && (
        <>
          {/* Amount hero */}
          <Card>
            <CardContent className="pt-6 pb-6 flex flex-col items-center gap-3 text-center">
              <div
                className={cn("h-14 w-14 rounded-full flex items-center justify-center", TYPE_COLOR[transaction.type])}
                aria-hidden="true"
              >
                {(() => { const Icon = TYPE_ICON[transaction.type]; return <Icon className="h-6 w-6" />; })()}
              </div>
              <p
                className={cn("text-3xl font-bold tabular-nums", transaction.type === "deposit" ? "text-green-700" : "")}
                aria-label={`Amount: ${transaction.type === "deposit" ? "+" : "-"}${formatCurrency(transaction.amount)}`}
              >
                {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{transaction.description}</p>
              <Badge variant={transaction.status === "completed" ? "success" : transaction.status === "pending" ? "warning" : "destructive"}>
                {transaction.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Detail fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl>
                <DetailRow label="Date" value={formatDate(transaction.date)} />
                <DetailRow label="Type" value={<span className="capitalize">{transaction.type}</span>} />
                <DetailRow label="Category" value={transaction.category} />
                <DetailRow label="Reference" value={<span className="font-mono text-xs">{transaction.reference}</span>} />
                {transaction.counterparty && (
                  <DetailRow label="Counterparty" value={transaction.counterparty} />
                )}
                <DetailRow label="Account" value={<span className="font-mono text-xs">{transaction.accountId}</span>} />
              </dl>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
