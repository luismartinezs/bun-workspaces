import { z } from "zod";

export const upgradeSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  plan: z.enum(["free", "pro", "enterprise"], {
    errorMap: () => ({ message: "Invalid plan type" }),
  }),
});

export type UpgradeInput = z.infer<typeof upgradeSchema>;
