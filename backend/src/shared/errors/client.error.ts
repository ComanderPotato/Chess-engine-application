import AppError from "./app-error.js";

class ClientError extends AppError {
  constructor(message: string, status_code: number) {
    super(message, status_code);
  }
}
export class BadRequest extends ClientError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class Unauthorized extends ClientError {
  constructor(message: string) {
    super(message, 401);
  }
}
export class Forbidden extends ClientError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class NotFound extends ClientError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class NotAcceptable extends ClientError {
  constructor(message: string) {
    super(message, 406);
  }
}
export class Conflict extends ClientError {
  constructor(message: string) {
    super(message, 409);
  }
}
