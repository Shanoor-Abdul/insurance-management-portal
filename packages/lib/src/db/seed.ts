import { connectDB } from "./connect";
import { PolicyModel, ClaimModel, UserModel, StatementModel, AuditLogModel, NotificationModel } from "./models";

const customers = [
  { name: "Ahmed Ali", email: "ahmed@example.com", mobile: "+971501234567", address: "Dubai" },
  { name: "Sara Khan", email: "sara@example.com", mobile: "+971502345678", address: "Abu Dhabi" },
  { name: "John Smith", email: "john@example.com", mobile: "+971503456789", address: "Sharjah" },
  { name: "Fatima Hassan", email: "fatima@example.com", mobile: "+971504567890", address: "Dubai" },
  { name: "Omar Farooq", email: "omar@example.com", mobile: "+971505678901", address: "Ajman" },
  { name: "Layla Mahmoud", email: "layla@example.com", mobile: "+971506789012", address: "Dubai" },
  { name: "Khalid Youssef", email: "khalid@example.com", mobile: "+971507890123", address: "Ras Al Khaimah" },
  { name: "Noura Saeed", email: "noura@example.com", mobile: "+971508901234", address: "Fujairah" }
];

const lobs = ["Health", "Motor", "General"];
const policyStatuses = ["Active", "Expired", "Cancelled", "Pending"];
const claimStatuses = ["Pending", "Approved", "Rejected", "Settled"];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  await connectDB();

  await PolicyModel.deleteMany({});
  await ClaimModel.deleteMany({});
  await UserModel.deleteMany({});
  await StatementModel.deleteMany({});
  await AuditLogModel.deleteMany({});
  await NotificationModel.deleteMany({});

  const users = await UserModel.insertMany([
    {
      name: "Admin User",
      employeeId: "E001",
      email: "admin@insurance.com",
      mobile: "+971500000001",
      username: "admin",
      password: "admin123",
      department: "IT",
      designation: "System Admin",
      status: "Active",
      role: "admin",
      policies: [],
      privileges: ["dashboard", "policies", "claims", "statements", "users", "assignPolicy", "editPolicy", "deletePolicy", "viewReports", "settings"]
    },
    {
      name: "Manager User",
      employeeId: "E002",
      email: "manager@insurance.com",
      mobile: "+971500000002",
      username: "manager",
      password: "manager123",
      department: "Operations",
      designation: "Operations Manager",
      status: "Active",
      role: "manager",
      policies: [],
      privileges: ["dashboard", "policies", "claims", "statements", "users", "assignPolicy", "editPolicy", "viewReports"]
    },
    {
      name: "Agent User",
      employeeId: "E003",
      email: "agent@insurance.com",
      mobile: "+971500000003",
      username: "agent",
      password: "agent123",
      department: "Sales",
      designation: "Sales Agent",
      status: "Active",
      role: "agent",
      policies: [],
      privileges: ["dashboard", "policies", "claims", "assignPolicy"]
    },
    {
      name: "Viewer User",
      employeeId: "E004",
      email: "viewer@insurance.com",
      mobile: "+971500000004",
      username: "viewer",
      password: "viewer123",
      department: "Finance",
      designation: "Finance Analyst",
      status: "Active",
      role: "viewer",
      policies: [],
      privileges: ["dashboard", "policies", "claims", "statements"]
    }
  ]);

  const policies = [];
  for (let i = 1; i <= 300; i++) {
    const customer = customers[i % customers.length];
    const lob = lobs[i % 3];
    const status = policyStatuses[i % 4];
    const start = randomDate(new Date(2022, 0, 1), new Date(2024, 0, 1));
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    const premium = 1000 + (i % 50) * 100 + Math.floor(Math.random() * 500);
    policies.push({
      policyNumber: `POL-${1000 + i}`,
      customer,
      lob,
      status,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      premium,
      coverage: `${lob} coverage for policy ${i}`,
      assignedUsers: i % 5 === 0 ? [users[0]._id.toString()] : [],
      paymentHistory: [],
      documents: [],
      claimHistory: []
    });
  }
  const insertedPolicies = await PolicyModel.insertMany(policies);

  const claims = [];
  for (let i = 0; i < 120; i++) {
    const policy = insertedPolicies[i % insertedPolicies.length];
    const lob = lobs[i % 3];
    const status = claimStatuses[i % 4];
    claims.push({
      claimNumber: `CLM-${3000 + i + 1}`,
      policyId: policy._id.toString(),
      policyNumber: policy.policyNumber,
      customer: policy.customer,
      lob,
      amount: 500 + (i % 20) * 100 + Math.floor(Math.random() * 200),
      status,
      submittedDate: randomDate(new Date(2023, 0, 1), new Date(2024, 6, 1)).toISOString().split("T")[0],
      notes: "Claim under review.",
      timeline: [{ id: `t${i}`, date: "2024-01-15", title: "Submitted", description: "Claim submitted" }],
      documents: []
    });
  }
  await ClaimModel.insertMany(claims);

  const statements = [];
  for (let i = 0; i < 200; i++) {
    const policy = insertedPolicies[i % insertedPolicies.length];
    const paid = i % 3 === 0 ? 0 : policy.premium * 0.5;
    const pending = policy.premium - paid;
    const due = randomDate(new Date(2023, 0, 1), new Date(2025, 0, 1));
    const isOverdue = due < new Date() && pending > 0;
    statements.push({
      policyId: policy._id.toString(),
      policyNumber: policy.policyNumber,
      customer: policy.customer,
      lob: policy.lob,
      premium: policy.premium,
      paidAmount: paid,
      pendingAmount: pending,
      dueDate: due.toISOString().split("T")[0],
      status: pending === 0 ? "Paid" : isOverdue ? "Overdue" : "Pending",
      paymentSchedule: [{ id: `s${i}`, dueDate: due.toISOString().split("T")[0], amount: policy.premium, status: pending === 0 ? "Paid" : "Pending" }],
      paymentHistory: paid > 0 ? [{ id: `p${i}`, date: "2024-02-01", amount: paid, method: "Card" }] : []
    });
  }
  await StatementModel.insertMany(statements);

  await AuditLogModel.insertMany([
    { action: "Policy Assigned", user: "admin", target: "POL-1001", timestamp: new Date().toISOString() },
    { action: "User Updated", user: "admin", target: "E002", timestamp: new Date().toISOString() }
  ]);

  await NotificationModel.insertMany([
    { title: "Policy Assigned", message: "Policy POL-1001 assigned to admin", type: "success", read: false, createdAt: new Date().toISOString() },
    { title: "Claim Submitted", message: "Claim CLM-3001 submitted", type: "info", read: false, createdAt: new Date().toISOString() }
  ]);

  console.log("Seeded: " + insertedPolicies.length + " policies, " + claims.length + " claims, " + users.length + " users, " + statements.length + " statements");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
