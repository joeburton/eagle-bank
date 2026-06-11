import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders a div element", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("has aria-hidden to hide from screen readers", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("includes the animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("merges custom className for sizing", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    expect(container.firstChild).toHaveClass("h-4", "w-32");
  });
});
