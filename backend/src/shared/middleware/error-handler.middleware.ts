import AppError from "../errors/app-error.js";
import { Next, Req, Res } from "../types/express.types.js";

export function errorHandler(err: AppError, req: Req, res: Res, next: Next) {
  res.status(err.statusCode).json({ error: err.message });
}
