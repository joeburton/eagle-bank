import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ background: "hsl(var(--brand-blue-dark))" }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
            E
          </div>
          <span className="text-xl font-semibold tracking-tight">Eagle Bank</span>
        </div>

        <div>
          <blockquote className="text-2xl font-light leading-relaxed mb-6">
            &ldquo;Banking made simple, secure, and transparent &mdash; built around you.&rdquo;
          </blockquote>
          <div className="flex gap-6 text-sm text-white/70">
            <span>🔒 256-bit encryption</span>
            <span>✓ FCA regulated</span>
            <span>🇬🇧 UK protected</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "hsl(var(--primary))" }}
            >
              E
            </div>
            <span className="text-lg font-semibold">Eagle Bank</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
