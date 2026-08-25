import AppError from "./app-error.js";

class ServerError extends AppError {
  constructor(message: string, status_code: number) {
    super(message, status_code);
  }
}

export class Internal extends ServerError {
  constructor(message: string) {
    super(message, 500);
  }
}
