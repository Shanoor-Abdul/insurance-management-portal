import { policies, claims, users, statements, notifications, auditLogs } from "../data";
import type { Policy, Claim, User, Statement, LOB, PolicyStatus, ClaimStatus, UserRole } from "../types";

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPolicies(filters?: {
  lob?: LOB | "All";
  search?: string;
  status?: PolicyStatus | "All";
  startDate?: string;
  endDate?: string;
}) {
  await wait();
  let result = [...policies];
  if (filters?.lob && filters.lob !== "All") result = result.filter((p) => p.lob === filters.lob);
  if (filters?.status && filters.status !== "All") result = result.filter((p) => p.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.policyNumber.toLowerCase().includes(q) ||
        p.customer.name.toLowerCase().includes(q)
    );
  }
  if (filters?.startDate) result = result.filter((p) => p.startDate >= filters.startDate!);
  if (filters?.endDate) result = result.filter((p) => p.endDate <= filters.endDate!);
  return result;
}

export async function getPolicyById(id: string) {
  await wait();
  return policies.find((p) => p.id === id) || null;
}

export async function assignPolicy(policyId: string, userIds: string[]) {
  await wait();
  const policy = policies.find((p) => p.id === policyId);
  if (!policy) return null;
  policy.assignedUsers = Array.from(new Set([...policy.assignedUsers, ...userIds]));
  return policy;
}

export async function getClaims(filters?: {
  lob?: LOB | "All";
  status?: ClaimStatus | "All";
  search?: string;
}) {
  await wait();
  let result = [...claims];
  if (filters?.lob && filters.lob !== "All") result = result.filter((c) => c.lob === filters.lob);
  if (filters?.status && filters.status !== "All") result = result.filter((c) => c.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((c) => c.claimNumber.toLowerCase().includes(q) || c.customer.name.toLowerCase().includes(q));
  }
  return result;
}

export async function getClaimById(id: string) {
  await wait();
  return claims.find((c) => c.id === id) || null;
}

export async function getStatements(filters?: { lob?: LOB | "All" }) {
  await wait();
  let result = [...statements];
  if (filters?.lob && filters.lob !== "All") result = result.filter((s) => s.lob === filters.lob);
  return result;
}

export async function getStatementById(id: string) {
  await wait();
  return statements.find((s) => s.id === id) || null;
}

export async function getUsers() {
  await wait();
  return [...users];
}

export async function getUserById(id: string) {
  await wait();
  return users.find((u) => u.id === id) || null;
}

export async function createUser(user: Omit<User, "id">) {
  await wait();
  const newUser = { ...user, id: `u${users.length + 1}` };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<User>) {
  await wait();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  return users[idx];
}

export async function deleteUser(id: string) {
  await wait();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
}

export async function getNotifications() {
  return [...notifications];
}

export async function getAuditLogs() {
  return [...auditLogs];
}
