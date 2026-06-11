import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileNav } from "@/components/mobile-nav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { usePathname } from "next/navigation";

describe("MobileNav", () => {
  it("renders all four navigation items", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<MobileNav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("marks the current route as active with aria-current='page'", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/accounts");
    render(<MobileNav />);
    expect(screen.getByRole("link", { name: /accounts/i })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on inactive links", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<MobileNav />);
    expect(screen.getByRole("link", { name: /accounts/i })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /transactions/i })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /profile/i })).not.toHaveAttribute("aria-current");
  });

  it("renders a nav element with the correct aria-label", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<MobileNav />);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });

  it("each nav item links to the correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<MobileNav />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /accounts/i })).toHaveAttribute("href", "/dashboard/accounts");
    expect(screen.getByRole("link", { name: /transactions/i })).toHaveAttribute("href", "/dashboard/transactions");
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/dashboard/profile");
  });
});
