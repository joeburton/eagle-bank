import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/auth-store";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const MOCK_USER = {
  id: "user-001",
  email: "test@example.com",
  fullName: "Test User",
  phone: "",
  address: "",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    localStorageMock.clear();
  });

  it("initial state is unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("setUser authenticates the user", () => {
    useAuthStore.getState().setUser(MOCK_USER, "test-token");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(MOCK_USER);
    expect(state.token).toBe("test-token");
  });

  it("setUser stores token in localStorage", () => {
    useAuthStore.getState().setUser(MOCK_USER, "test-token");
    expect(localStorageMock.getItem("eagle-bank-token")).toBe("test-token");
  });

  it("logout clears user state", () => {
    useAuthStore.getState().setUser(MOCK_USER, "test-token");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("logout removes token from localStorage", () => {
    useAuthStore.getState().setUser(MOCK_USER, "test-token");
    useAuthStore.getState().logout();
    expect(localStorageMock.getItem("eagle-bank-token")).toBeNull();
  });

  it("setError sets the error message", () => {
    useAuthStore.getState().setError("Invalid credentials");
    expect(useAuthStore.getState().error).toBe("Invalid credentials");
  });

  it("clearError resets error to null", () => {
    useAuthStore.getState().setError("Some error");
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it("setLoading toggles loading state", () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
