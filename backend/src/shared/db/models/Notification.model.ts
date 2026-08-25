// import { HydratedDocument, Schema, Types, model } from "mongoose";

// export interface IConversation {
//   id: string;
//   participants: Types.ObjectId[];
//
//   lastMessage?: Types.ObjectId;
//
//   createdAt: Date;
//   updatedAt: Date;
// }
//
// export const ConversationSchema = new Schema<IConversation>(
//   {
//     participants: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ],
//     lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
//   },
//   { timestamps: true },
// );
// //
// export const ConversationModel = model<IConversation>(
//   "Conversation",
//   ConversationSchema,
// );
// export type ConversationDocument = HydratedDocument<IConversation>;
