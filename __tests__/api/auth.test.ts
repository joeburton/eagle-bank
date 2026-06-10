import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Simple helper to simulate the API client behaviour
async function loginRequest(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}

describe("Auth API", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns user and token on successful login", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          user: { id: "user-001", email: "joe.burton@eaglebank.com", fullName: "Joe Burton" },
          token: "mock-token",
        },
        message: "Login successful",
      }),
    });

    const result = await loginRequest("joe.burton@eaglebank.com", "password");
    expect(result.data.user.email).toBe("joe.burton@eaglebank.com");
    expect(result.data.token).toBe("mock-token");
  });

  it("throws on invalid credentials", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid email or password" }),
    });

    await expect(loginRequest("bad@email.com", "wrong")).rejects.toMatchObject({
      message: "Invalid email or password",
    });
  });

  it("calls the correct endpoint with POST method", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { user: {}, token: "" } }),
    });

    await loginRequest("test@example.com", "pass");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends credentials in request body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { user: {}, token: "" } }),
    });

    await loginRequest("test@example.com", "mypassword");
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.email).toBe("test@example.com");
    expect(body.password).toBe("mypassword");
  });
});
