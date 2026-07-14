export type Lang = "en" | "ar";

export type LOB = "Health" | "Motor" | "General";

export type PolicyStatus = "Active" | "Expired" | "Cancelled" | "Pending";

export type ClaimStatus = "Pending" | "Approved" | "Rejected" | "Settled";

export type UserRole = "admin" | "manager" | "agent" | "viewer";

export type UserStatus = "Active" | "Inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  customer: Customer;
  lob: LOB;
  status: PolicyStatus;
  startDate: string;
  endDate: string;
  premium: number;
  coverage: string;
  assignedUsers: string[];
  paymentHistory: Payment[];
  documents: Document[];
  claimHistory: string[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customer: Customer;
  lob: LOB;
  amount: number;
  status: ClaimStatus;
  submittedDate: string;
  notes: string;
  timeline: TimelineEvent[];
  documents: Document[];
}

export interface Statement {
  id: string;
  policyId: string;
  policyNumber: string;
  customer: Customer;
  lob: LOB;
  premium: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  paymentSchedule: PaymentScheduleItem[];
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
}

export interface PaymentScheduleItem {
  id: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

export interface Document {
  id: string;
  name: string;
  url: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface UserPrivilege {
  id: string;
  label: string;
  enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  mobile: string;
  username: string;
  department: string;
  designation: string;
  status: UserStatus;
  role: UserRole;
  policies: string[];
  privileges: string[];
}

export type { Privilege } from "../rbac";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
}

export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: string;
}
