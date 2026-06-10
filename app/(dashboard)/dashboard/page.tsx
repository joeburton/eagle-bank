"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { DashboardData } from "@/types";
import Link from "next/link";

import { useAuthStore } from "@/stores/auth-store";

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuthStore();

  console.log("User details:", user);
  console.log("Mock JWT token:", token);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get<{ data: DashboardData }>("/dashboard");
        setData(res.data);
      } catch {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        role="alert"
      >
        <p className="text-[hsl(var(--destructive))]">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Balance",
      value: data ? formatCurrency(data.totalBalance) : null,
      icon: Wallet,
      description: "Across all accounts",
      color: "hsl(var(--primary))",
    },
    {
      label: "Monthly Deposits",
      value: data ? formatCurrency(data.monthlyDeposits) : null,
      icon: TrendingUp,
      description: "This month",
      color: "hsl(var(--brand-green))",
    },
    {
      label: "Monthly Withdrawals",
      value: data ? formatCurrency(data.monthlyWithdrawals) : null,
      icon: TrendingDown,
      description: "This month",
      color: "hsl(var(--brand-red))",
    },
    {
      label: "Transactions",
      value: data ? String(data.recentTransactions.length) : null,
      icon: ArrowLeftRight,
      description: "Recent activity",
      color: "hsl(var(--muted-foreground))",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isLoading ? (
            <Skeleton className="h-8 w-48 inline-block" />
          ) : (
            <>Good morning, {data?.user.fullName.split(" ")[0]} 👋</>
          )}
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
          Here&apos;s your financial overview
        </p>
      </div>

      {/* Stats grid */}
      <section aria-label="Account summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : stats.map(({ label, value, icon: Icon, description, color }) => (
                <Card key={label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                      {label}
                    </CardTitle>
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color }}
                      aria-hidden="true"
                    />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="text-base font-semibold mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/transactions">View transactions</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/accounts">Manage accounts</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/profile">Edit profile</Link>
          </Button>
        </div>
      </section>

      {/* Recent transactions */}
      <section aria-label="Recent transactions">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent transactions</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/transactions">View all</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg border border-[hsl(var(--border))]"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : !data?.recentTransactions.length ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <ArrowLeftRight
              className="h-8 w-8 mx-auto mb-2 opacity-40"
              aria-hidden="true"
            />
            <p className="text-sm">No recent transactions</p>
          </div>
        ) : (
          <div
            className="space-y-2"
            role="list"
            aria-label="Recent transactions list"
          >
            {data.recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer"
                role="listitem"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                    txn.type === "deposit"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                  aria-hidden="true"
                >
                  {txn.type === "deposit" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {txn.description}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatDate(txn.date)}
                    {txn.counterparty ? ` · ${txn.counterparty}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      txn.type === "deposit"
                        ? "text-green-700"
                        : "text-[hsl(var(--foreground))]",
                    )}
                  >
                    {txn.type === "deposit" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </p>
                  <Badge
                    variant={txn.status === "completed" ? "success" : "warning"}
                    className="text-xs mt-0.5"
                  >
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
