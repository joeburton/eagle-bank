export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: "savings" | "credit" | "current";
  balance: number;
  availableBalance: number;
  currency: string;
  status: "active" | "frozen" | "closed";
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string;
  category: string;
  date: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  counterparty?: string;
}

export interface DashboardData {
  user: User;
  totalBalance: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
  recentTransactions: Transaction[];
  accounts: Account[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: Transaction["type"] | "all";
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
