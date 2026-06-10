"use client";

import { useAuthStore } from "@/stores/auth-store";

export function MobileHeader() {
  const { user } = useAuthStore();

  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      aria-label="Site header"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ background: "hsl(var(--primary))" }}
          aria-hidden="true"
        >
          E
        </div>
        <span className="font-semibold text-sm tracking-tight">Eagle Bank</span>
      </div>

      {/* User avatar */}
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
        style={{ background: "hsl(var(--primary))" }}
        aria-label={`Signed in as ${user?.fullName ?? "User"}`}
        role="img"
      >
        {user?.fullName?.charAt(0) ?? "U"}
      </div>
    </header>
  );
}
