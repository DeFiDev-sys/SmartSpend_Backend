import { Types } from "mongoose";
import jwt from 'jsonwebtoken'

export const genToken = (id : Types.ObjectId) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
}


export const generateResetToken = (id: Types.ObjectId)=>{
    return jwt.sign({ id }, process.env.TOKEN_SECRET!, { expiresIn: '15m' });
}