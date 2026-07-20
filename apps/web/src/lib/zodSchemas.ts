import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().min(1, "Mobile is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  status: z.enum(["Active", "Inactive"]),
  role: z.enum(["admin", "manager", "agent", "viewer"])
}).superRefine((data, ctx) => {
  if (data.password && data.password.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 6 characters",
      path: ["password"]
    });
  }
  if (data.password && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });
  }
});

export type UserFormData = z.infer<typeof userSchema>;
