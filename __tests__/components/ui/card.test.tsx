import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>card body</Card>);
    expect(screen.getByText("card body")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="my-4">content</Card>);
    expect(container.firstChild).toHaveClass("my-4");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>header content</CardHeader>);
    expect(screen.getByText("header content")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders as an h3 element", () => {
    render(<CardTitle>Account summary</CardTitle>);
    expect(screen.getByRole("heading", { name: "Account summary", level: 3 })).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders children", () => {
    render(<CardDescription>Manage your accounts</CardDescription>);
    expect(screen.getByText("Manage your accounts")).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>content area</CardContent>);
    expect(screen.getByText("content area")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>footer area</CardFooter>);
    expect(screen.getByText("footer area")).toBeInTheDocument();
  });
});

describe("Card composition", () => {
  it("renders a fully composed card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Card</CardTitle>
          <CardDescription>A description</CardDescription>
        </CardHeader>
        <CardContent>Body text</CardContent>
        <CardFooter>Footer text</CardFooter>
      </Card>
    );
    expect(screen.getByRole("heading", { name: "My Card" })).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });
});
