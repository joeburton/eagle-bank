import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div
        className="text-7xl font-bold tabular-nums"
        style={{ color: "hsl(var(--primary))" }}
        aria-hidden="true"
      >
        404
      </div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  );
}
