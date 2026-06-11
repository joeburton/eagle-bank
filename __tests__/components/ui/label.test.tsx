import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

describe("Label", () => {
  it("renders its text content", () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("associates with an input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Label className="sr-only">Hidden label</Label>);
    expect(container.firstChild).toHaveClass("sr-only");
  });
});
