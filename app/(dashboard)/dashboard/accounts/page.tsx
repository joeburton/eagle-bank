"use client";

import { useEffect, useState } from "react";
import { CreditCard, PiggyBank, Landmark } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { formatCurrency, maskAccountNumber } from "@/lib/utils";
import type { Account } from "@/types";

const ACCOUNT_ICONS: Record<Account["type"], React.ElementType> = {
  savings: PiggyBank,
  credit: CreditCard,
  current: Landmark,
};

const ACCOUNT_LABELS: Record<Account["type"], string> = {
  savings: "Savings Account",
  credit: "Credit Card",
  current: "Current Account",
};

function AccountCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-36 mt-2" />
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-40 mb-1" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Account[] }>("/accounts");
      setAccounts(res.data);
    } catch {
      setError("Failed to load accounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
          Manage your bank accounts
        </p>
      </div>

      {error && (
        <div className="flex flex-col items-center gap-3 py-12" role="alert">
          <p className="text-[hsl(var(--destructive))] text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchAccounts}>Retry</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Accounts list">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <AccountCardSkeleton key={i} />)
          : accounts.map((account) => {
              const Icon = ACCOUNT_ICONS[account.type];
              return (
                <Card
                  key={account.id}
                  className="relative overflow-hidden"
                  aria-label={`${ACCOUNT_LABELS[account.type]}`}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-8 translate-x-8"
                    style={{ background: "hsl(var(--primary))" }}
                    aria-hidden="true"
                  />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ background: "hsl(var(--primary) / 0.1)" }}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <Badge variant={account.status === "active" ? "success" : "secondary"}>
                        {account.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{ACCOUNT_LABELS[account.type]}</CardTitle>
                    <CardDescription>{maskAccountNumber(account.accountNumber)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold" aria-label={`Balance: ${formatCurrency(account.balance)}`}>
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {account.type === "credit"
                        ? `Available credit: ${formatCurrency(account.availableBalance)}`
                        : "Available balance"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
