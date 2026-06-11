import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileHeader } from "@/components/mobile-header";

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "@/stores/auth-store";

describe("MobileHeader", () => {
  it("renders the Eagle Bank logo text", () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: null } as ReturnType<typeof useAuthStore>);
    render(<MobileHeader />);
    expect(screen.getByText("Eagle Bank")).toBeInTheDocument();
  });

  it("shows the first letter of the user's name as avatar", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { fullName: "Joe Burton", email: "joe@test.com" },
    } as ReturnType<typeof useAuthStore>);
    render(<MobileHeader />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows 'U' when no user is logged in", () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: null } as ReturnType<typeof useAuthStore>);
    render(<MobileHeader />);
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("has an accessible aria-label with the user's name", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { fullName: "Joe Burton", email: "joe@test.com" },
    } as ReturnType<typeof useAuthStore>);
    render(<MobileHeader />);
    expect(screen.getByRole("img", { name: "Signed in as Joe Burton" })).toBeInTheDocument();
  });

  it("has the correct aria-label on the site header", () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: null } as ReturnType<typeof useAuthStore>);
    render(<MobileHeader />);
    expect(screen.getByRole("banner", { name: "Site header" })).toBeInTheDocument();
  });
});
