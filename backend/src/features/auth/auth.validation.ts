import { Next, Req, Res } from "@/shared/types/express.types.js";
import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[0-9]/, "Must contain number");

export const signupSchema = z.object({
  username: z.string().min(8),
  password: passwordSchema,
  email: z.email(),
});

type ValidationTarget = "body" | "params" | "query";

export function validate(
  validationTarget: ValidationTarget,
  schema: z.ZodSchema,
) {
  return (req: Req, res: Res, next: Next) => {
    const result = schema.safeParse(req[validationTarget]);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }
    req[validationTarget] = result.data;
    next();
  };
}
