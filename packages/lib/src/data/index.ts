import { privileges } from "../rbac";
import type { Policy, Claim, User, Statement, Notification, AuditLog, Customer } from "../types";

const customers: Customer[] = [
  { id: "c1", name: "Ahmed Ali", email: "ahmed@example.com", mobile: "+971501234567", address: "Dubai" },
  { id: "c2", name: "Sara Khan", email: "sara@example.com", mobile: "+971502345678", address: "Abu Dhabi" },
  { id: "c3", name: "John Smith", email: "john@example.com", mobile: "+971503456789", address: "Sharjah" },
  { id: "c4", name: "Fatima Hassan", email: "fatima@example.com", mobile: "+971504567890", address: "Dubai" },
  { id: "c5", name: "Omar Farooq", email: "omar@example.com", mobile: "+971505678901", address: "Ajman" }
];

function generatePolicies(): Policy[] {
  const lobs = ["Health", "Motor", "General"] as const;
  const statuses = ["Active", "Expired", "Cancelled", "Pending"] as const;
  const policies: Policy[] = [];
  for (let i = 1; i <= 50; i++) {
    const lob = lobs[i % 3];
    const status = statuses[i % 4];
    const start = new Date(2023, (i % 12), 1);
    const end = new Date(2024, (i % 12), 1);
    policies.push({
      id: `p${i}`,
      policyNumber: `POL-${1000 + i}`,
      customer: customers[i % customers.length],
      lob,
      status,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      premium: 1000 + i * 50,
      coverage: `${lob} coverage for policy ${i}`,
      assignedUsers: i % 3 === 0 ? ["u1"] : [],
      paymentHistory: [{ id: `pay${i}`, date: "2023-06-01", amount: 1000, method: "Bank Transfer" }],
      documents: [],
      claimHistory: []
    });
  }
  return policies;
}

export const policies: Policy[] = generatePolicies();

export const claims: Claim[] = Array.from({ length: 30 }, (_, i) => {
  const statuses = ["Pending", "Approved", "Rejected", "Settled"] as const;
  const lob = ["Health", "Motor", "General"][i % 3] as Policy["lob"];
  const policy = policies[i % policies.length];
  return {
    id: `cl${i + 1}`,
    claimNumber: `CLM-${2000 + i + 1}`,
    policyId: policy.id,
    policyNumber: policy.policyNumber,
    customer: policy.customer,
    lob,
    amount: 500 + i * 100,
    status: statuses[i % 4],
    submittedDate: `2024-0${(i % 9) + 1}-15`,
    notes: "Claim under review.",
    timeline: [{ id: "t1", date: "2024-01-15", title: "Submitted", description: "Claim submitted" }],
    documents: []
  };
});

export const users: User[] = [
  {
    id: "u1",
    name: "Admin User",
    employeeId: "E001",
    email: "admin@insurance.com",
    mobile: "+971500000001",
    username: "admin",
    department: "IT",
    designation: "System Admin",
    status: "Active",
    role: "admin",
    policies: ["p1", "p2"],
    privileges: privileges.map((p) => p.id)
  },
  {
    id: "u2",
    name: "Manager User",
    employeeId: "E002",
    email: "manager@insurance.com",
    mobile: "+971500000002",
    username: "manager",
    department: "Operations",
    designation: "Operations Manager",
    status: "Active",
    role: "manager",
    policies: ["p3"],
    privileges: ["dashboard", "policies", "claims", "statements", "users"]
  }
];

export const statements: Statement[] = Array.from({ length: 40 }, (_, i) => {
  const policy = policies[i % policies.length];
  const paid = i % 3 === 0 ? 0 : policy.premium * 0.5;
  const pending = policy.premium - paid;
  const due = new Date(2024, (i % 12), 1).toISOString().split("T")[0];
  return {
    id: `st${i + 1}`,
    policyId: policy.id,
    policyNumber: policy.policyNumber,
    customer: policy.customer,
    lob: policy.lob,
    premium: policy.premium,
    paidAmount: paid,
    pendingAmount: pending,
    dueDate: due,
    status: pending === 0 ? "Paid" : new Date(due) < new Date() ? "Overdue" : "Pending",
    paymentSchedule: [{ id: `s${i}`, dueDate: due, amount: policy.premium, status: pending === 0 ? "Paid" : "Pending" }],
    paymentHistory: paid > 0 ? [{ id: `pay${i}`, date: "2024-02-01", amount: paid, method: "Card" }] : []
  };
});

export const notifications: Notification[] = [
  { id: "n1", title: "Policy Assigned", message: "Policy POL-1001 assigned to admin", type: "success", read: false, createdAt: "2024-06-01T10:00:00Z" },
  { id: "n2", title: "Claim Submitted", message: "Claim CLM-2001 submitted", type: "info", read: false, createdAt: "2024-06-02T11:00:00Z" }
];

export const auditLogs: AuditLog[] = [
  { id: "a1", action: "Policy Assigned", user: "admin", target: "POL-1001", timestamp: "2024-06-01T10:00:00Z" },
  { id: "a2", action: "User Updated", user: "admin", target: "u2", timestamp: "2024-06-02T12:00:00Z" }
];
