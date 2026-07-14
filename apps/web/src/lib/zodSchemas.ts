import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().min(1, "Mobile is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  status: z.enum(["Active", "Inactive"]),
  role: z.enum(["admin", "manager", "agent", "viewer"])
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type UserFormData = z.infer<typeof userSchema>;
