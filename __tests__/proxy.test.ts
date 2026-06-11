import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/server so we can test proxy logic without a Next.js runtime
vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(() => ({ type: "next" })),
    redirect: vi.fn((url: URL) => ({ type: "redirect", url: url.toString() })),
    json: vi.fn((body: unknown, init?: { status?: number }) => ({
      type: "json",
      body,
      status: init?.status,
    })),
  },
}));

import { proxy } from "@/proxy";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:3000";

function makeRequest(pathname: string, authenticated = false) {
  return {
    nextUrl: { pathname },
    url: `${BASE_URL}${pathname}`,
    cookies: {
      get: (name: string) =>
        authenticated && name === "is-authenticated" ? { value: "1" } : undefined,
    },
  } as Parameters<typeof proxy>[0];
}

describe("proxy — root redirect", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects unauthenticated users at / to /login", () => {
    proxy(makeRequest("/"));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", BASE_URL)
    );
  });

  it("redirects authenticated users at / to /dashboard", () => {
    proxy(makeRequest("/", true));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/dashboard", BASE_URL)
    );
  });
});

describe("proxy — protected dashboard routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects unauthenticated users away from /dashboard", () => {
    proxy(makeRequest("/dashboard"));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", BASE_URL)
    );
  });

  it("redirects unauthenticated users away from nested dashboard routes", () => {
    proxy(makeRequest("/dashboard/transactions"));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", BASE_URL)
    );
  });

  it("allows authenticated users through to /dashboard", () => {
    proxy(makeRequest("/dashboard", true));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});

describe("proxy — auth pages", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows unauthenticated users to access /login", () => {
    proxy(makeRequest("/login"));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("allows unauthenticated users to access /register", () => {
    proxy(makeRequest("/register"));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("redirects authenticated users away from /login", () => {
    proxy(makeRequest("/login", true));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/dashboard", BASE_URL)
    );
  });

  it("redirects authenticated users away from /register", () => {
    proxy(makeRequest("/register", true));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/dashboard", BASE_URL)
    );
  });
});

describe("proxy — API routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows unauthenticated requests to /api/auth routes", () => {
    proxy(makeRequest("/api/auth/login"));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });

  it("returns 401 for unauthenticated requests to protected API routes", () => {
    proxy(makeRequest("/api/accounts"));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Unauthorized" },
      { status: 401 }
    );
  });

  it("allows authenticated requests to protected API routes", () => {
    proxy(makeRequest("/api/accounts", true));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });
});
