import { NavSidebar } from "@/components/nav-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      {/* Desktop sidebar — hidden on mobile */}
      <aside
        className="hidden md:flex w-64 shrink-0 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        aria-label="Sidebar"
      >
        <NavSidebar />
      </aside>

      {/* Right-hand column — scrollable */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header — hidden on desktop */}
        <MobileHeader />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex={-1}
        >
          <ErrorBoundary>
            {/* pb-24 on mobile makes room for the fixed bottom tab bar */}
            <div className="page-enter p-4 pb-24 md:p-8 md:pb-8 max-w-7xl mx-auto">
              {children}
            </div>
          </ErrorBoundary>
        </main>

        {/* Mobile bottom tab bar — hidden on desktop */}
        <MobileNav />
      </div>
    </div>
  );
}
