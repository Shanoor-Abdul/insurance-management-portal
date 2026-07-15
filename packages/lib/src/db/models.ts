import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  address: String
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  id: String,
  date: String,
  amount: Number,
  method: String
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  id: String,
  name: String,
  url: String
}, { _id: false });

const TimelineEventSchema = new mongoose.Schema({
  id: String,
  date: String,
  title: String,
  description: String
}, { _id: false });

const PaymentScheduleItemSchema = new mongoose.Schema({
  id: String,
  dueDate: String,
  amount: Number,
  status: String
}, { _id: false });

const PolicySchema = new mongoose.Schema({
  policyNumber: String,
  customer: CustomerSchema,
  lob: String,
  status: String,
  startDate: String,
  endDate: String,
  premium: Number,
  coverage: String,
  assignedUsers: [String],
  paymentHistory: [PaymentSchema],
  documents: [DocumentSchema],
  claimHistory: [String]
}, { timestamps: true });

const ClaimSchema = new mongoose.Schema({
  claimNumber: String,
  policyId: String,
  policyNumber: String,
  customer: CustomerSchema,
  lob: String,
  amount: Number,
  status: String,
  submittedDate: String,
  notes: String,
  timeline: [TimelineEventSchema],
  documents: [DocumentSchema]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  email: String,
  mobile: String,
  username: String,
  password: String,
  department: String,
  designation: String,
  status: String,
  role: String,
  policies: [String],
  privileges: [String]
}, { timestamps: true });

const StatementSchema = new mongoose.Schema({
  policyId: String,
  policyNumber: String,
  customer: CustomerSchema,
  lob: String,
  premium: Number,
  paidAmount: Number,
  pendingAmount: Number,
  dueDate: String,
  status: String,
  paymentSchedule: [PaymentScheduleItemSchema],
  paymentHistory: [PaymentSchema]
}, { timestamps: true });

const AuditLogSchema = new mongoose.Schema({
  action: String,
  user: String,
  target: String,
  timestamp: String
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  read: Boolean,
  createdAt: String
}, { timestamps: true });

export const PolicyModel = mongoose.models.Policy || mongoose.model("Policy", PolicySchema);
export const ClaimModel = mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const StatementModel = mongoose.models.Statement || mongoose.model("Statement", StatementSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
