import { UserDocument } from "../db/models/User.model.js";
import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      fart: string;
    }
  }
}
// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserDocument;
//     }
//   }
// }
//
// export {};
