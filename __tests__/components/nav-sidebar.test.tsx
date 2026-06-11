import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavSidebar } from "@/components/nav-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useAuth } from "@/hooks/use-auth";

const mockUser = { fullName: "Joe Burton", email: "joe@eaglebank.com" };

describe("NavSidebar", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser } as ReturnType<typeof useAuthStore>);
    vi.mocked(useAuth).mockReturnValue({ logout: vi.fn() } as ReturnType<typeof useAuth>);
  });

  it("renders all four navigation links", () => {
    render(<NavSidebar />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /accounts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /transactions/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
  });

  it("marks the active route with aria-current='page'", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/accounts");
    render(<NavSidebar />);
    expect(screen.getByRole("link", { name: /accounts/i })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on inactive links", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<NavSidebar />);
    expect(screen.getByRole("link", { name: /accounts/i })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /transactions/i })).not.toHaveAttribute("aria-current");
  });

  it("displays the logged-in user's name", () => {
    render(<NavSidebar />);
    expect(screen.getByText("Joe Burton")).toBeInTheDocument();
  });

  it("displays the logged-in user's email", () => {
    render(<NavSidebar />);
    expect(screen.getByText("joe@eaglebank.com")).toBeInTheDocument();
  });

  it("renders a sign out button", () => {
    render(<NavSidebar />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("calls logout when the sign out button is clicked", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ logout } as ReturnType<typeof useAuth>);
    render(<NavSidebar />);
    await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(logout).toHaveBeenCalledOnce();
  });

  it("renders the Eagle Bank logo text", () => {
    render(<NavSidebar />);
    expect(screen.getByText("Eagle Bank")).toBeInTheDocument();
  });

  it("has a main navigation landmark", () => {
    render(<NavSidebar />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });
});
