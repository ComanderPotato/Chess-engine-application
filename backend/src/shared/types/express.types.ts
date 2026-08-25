// Or should it be express.types.d.ts?
import { Request, Response, NextFunction } from "express";
import { UserDocument } from "models/User.model.js";

export type Req<Params = unknown, Body = unknown, Query = unknown> = Request<
  Params,
  {},
  Body,
  Query
>;
export type Res<T = any> = Response<T>;
export type Next = NextFunction;
//
// export type AuthenticatedReq<
//   Params = unknown,
//   Body = unknown,
//   Query = unknown,
// > extends Req<Params, Body, Query> {
//   user: UserDocument;
// }
