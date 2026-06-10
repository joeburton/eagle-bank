"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: CreditCard },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuthStore();

  return (
    <nav
      className="flex flex-col h-full py-6 px-4"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: "hsl(var(--primary))" }}
          aria-hidden="true"
        >
          E
        </div>
        <span className="font-semibold text-base tracking-tight">
          Eagle Bank
        </span>
      </div>

      {/* Nav links */}
      <ul className="flex-1 space-y-1" role="list">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User + logout */}
      <div className="border-t border-[hsl(var(--border))] pt-4 mt-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ background: "hsl(var(--primary))" }}
            aria-hidden="true"
          >
            {user?.fullName?.charAt(0) ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </nav>
  );
}
