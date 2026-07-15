import type { Policy, Claim, User, Statement, LOB, PolicyStatus, ClaimStatus } from "../types";

const baseUrl = typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" : "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${url}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getPolicies(filters?: {
  lob?: LOB | "All";
  search?: string;
  status?: PolicyStatus | "All";
  startDate?: string;
  endDate?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.lob && filters.lob !== "All") params.set("lob", filters.lob);
  if (filters?.status && filters.status !== "All") params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  return fetchJson<Policy[]>(`/api/policies?${params.toString()}`);
}

export async function getPolicyById(id: string) {
  return fetchJson<Policy | null>(`/api/policies/${id}`);
}

export async function assignPolicy(policyId: string, userIds: string[]) {
  return fetchJson<Policy>(`/api/policies/${policyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedUsers: userIds })
  });
}

export async function getClaims(filters?: {
  lob?: LOB | "All";
  status?: ClaimStatus | "All";
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.lob && filters.lob !== "All") params.set("lob", filters.lob);
  if (filters?.status && filters.status !== "All") params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  return fetchJson<Claim[]>(`/api/claims?${params.toString()}`);
}

export async function getClaimById(id: string) {
  return fetchJson<Claim | null>(`/api/claims/${id}`);
}

export async function getStatements(filters?: { lob?: LOB | "All" }) {
  const params = new URLSearchParams();
  if (filters?.lob && filters.lob !== "All") params.set("lob", filters.lob);
  return fetchJson<Statement[]>(`/api/statements?${params.toString()}`);
}

export async function getStatementById(id: string) {
  return fetchJson<Statement | null>(`/api/statements/${id}`);
}

export async function getUsers() {
  return fetchJson<User[]>("/api/users");
}

export async function getUserById(id: string) {
  return fetchJson<User | null>(`/api/users/${id}`);
}

export async function createUser(user: Omit<User, "id">) {
  return fetchJson<User>("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
}

export async function updateUser(id: string, data: Partial<User>) {
  return fetchJson<User>(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id: string) {
  return fetchJson<{ success: boolean }>(`/api/users/${id}`, { method: "DELETE" });
}

export async function getCurrentUser() {
  return fetchJson<User | null>("/api/auth/me");
}
