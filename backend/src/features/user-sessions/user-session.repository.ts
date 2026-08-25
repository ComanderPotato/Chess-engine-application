import { Internal } from "@/shared/errors/server.error.js";
import { MongoId } from "@/shared/types/data.types.js";
import {
  UserSessionModel,
  UserSessionDocument,
  IUserSession,
} from "models/User-Session.model.js";
import { ClientSession } from "mongoose";

// Interface,
// Document extends HydratedDocument<Interface>,
// RepoModel extends Model<Interface, {}, {}, {}, Document>,
// class Repository<Doc extends HydratedDocument<any>> {
//   private repositoryModel: Model<Doc>;

//   constructor(model: Model<Doc>) {
//     this.repositoryModel = model;
//   }

//   async create(data: Partial<Doc>, session?: ClientSession): Promise<Doc> {
//     const [document] = await this.repositoryModel.create([data], { session });

//     if (!document) {
//       throw new Internal("Error creating document");
//     }

//     return document;
//   }
// }
export async function create(
  userId: MongoId,
  tokenHash: string,
  session: ClientSession | null = null,
): Promise<UserSessionDocument> {
  const [userSession] = await UserSessionModel.create(
    [
      {
        userId,
        tokenHash,
      },
    ],
    { session },
  );
  if (!userSession) throw new Internal("Error creating user session");
  return userSession;
}

export async function findById(
  userSessionId: MongoId,
  session: ClientSession | null = null,
): Promise<UserSessionDocument | null> {
  return await UserSessionModel.findById(userSessionId, null, { session });
}
export async function findByUserId(
  userId: MongoId,
  session: ClientSession | null = null,
): Promise<UserSessionDocument | null> {
  return await UserSessionModel.findOne({ userId }, null, { session });
}
export async function findByTokenHash(
  tokenHash: string,
  session: ClientSession | null = null,
): Promise<UserSessionDocument | null> {
  return await UserSessionModel.findOne({ tokenHash }, null, { session });
}
export async function updateById(
  userSessionId: MongoId,
  updates: Partial<IUserSession>,
  session: ClientSession | null = null,
): Promise<UserSessionDocument | null> {
  return await UserSessionModel.findByIdAndUpdate(userSessionId, updates, {
    returnDocument: "after", // Returns the updated documents
    runValidators: true, // Mongoose applies schema validation if applicable
    strict: true, // Reject extra fields
    timestamps: false,
    session,
  });
}
export async function deleteById(
  userSessionId: MongoId,
  session: ClientSession | null = null,
): Promise<boolean> {
  const result = await UserSessionModel.deleteOne(
    { _id: userSessionId },
    session && { session },
  );

  return result.deletedCount > 0;
}
