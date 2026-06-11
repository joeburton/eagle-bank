import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("renders with a given type", () => {
    render(<Input type="password" data-testid="pwd" />);
    expect(screen.getByTestId("pwd")).toHaveAttribute("type", "password");
  });

  it("fires onChange when the user types", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("reflects the typed value", async () => {
    render(<Input defaultValue="" />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "eagle");
    expect(input).toHaveValue("eagle");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards aria attributes", () => {
    render(<Input aria-label="Email address" aria-required="true" />);
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("merges custom className", () => {
    render(<Input className="w-64" />);
    expect(screen.getByRole("textbox")).toHaveClass("w-64");
  });
});
