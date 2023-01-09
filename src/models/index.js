// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Type = {
  "CHANNEL": "CHANNEL",
  "THREAD": "THREAD",
  "CHATROOM": "CHATROOM"
};

const AttachmentType = {
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
};

const { Attachment, ChatRoom, Message, User, UserChatRoom } = initSchema(schema);

export {
  Attachment,
  ChatRoom,
  Message,
  User,
  UserChatRoom,
  Type,
  AttachmentType
};