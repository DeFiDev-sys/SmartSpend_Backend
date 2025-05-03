import mongoose from "mongoose";
import { IUser } from "../types/definitions";

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    admin: {
      type: Boolean,
      default: false,
    },
    usedResetTokens: [
      {
        token: String,
        usedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>('User', UserSchema)

export default User;