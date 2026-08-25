// DTO = data transfer object
import { Types } from "mongoose";

export interface CreateMessageDTO {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
}
export interface UpdateMessageDto {
  content?: string;
}
