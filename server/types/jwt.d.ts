import { Types } from 'mongoose';

declare module 'jsonwebtoken' {
  interface JwtPayload {
    id: Types.ObjectId;
  }
}