import mongoose, { Types } from "mongoose";
//global definitions
declare global {
    namespace Express {
      interface Request {
        userId: Types.ObjectId;
        user:IUser;
        cookies: {
          token: string;
        }
      }
      interface Headers {
        authorization?: string;
      }
    }
}


//user types
export interface IUser extends Document {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    username:string;
    email: string;
    password: string;
    admin:boolean;
    usedResetTokens:{
      token: String,
      usedAt:Date
    }[]
}

export interface IExpenses extends Document {
  user:Types.ObjectId | IUser,
  title:string,
  amount:number,
  category:string,
  date:Date,
}

export type SortOptions = {
  date?: 1 | -1;
  amount?: 1 | -1;
};