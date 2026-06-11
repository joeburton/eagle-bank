import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>completed</Badge>);
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("renders with default variant by default", () => {
    const { container } = render(<Badge>default</Badge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders success variant", () => {
    const { container } = render(<Badge variant="success">completed</Badge>);
    expect(container.firstChild).toHaveClass("bg-green-100", "text-green-800");
  });

  it("renders warning variant", () => {
    const { container } = render(<Badge variant="warning">pending</Badge>);
    expect(container.firstChild).toHaveClass("bg-yellow-100", "text-yellow-800");
  });

  it("renders destructive variant", () => {
    const { container } = render(<Badge variant="destructive">failed</Badge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders outline variant", () => {
    const { container } = render(<Badge variant="outline">label</Badge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="mt-2">tag</Badge>);
    expect(container.firstChild).toHaveClass("mt-2");
  });
});
