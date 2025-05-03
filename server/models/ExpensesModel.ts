import mongoose from "mongoose";
import { IExpenses } from "../types/definitions";

const ExpensesSchema = new mongoose.Schema<IExpenses>(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        title:{
            type:String,required:true
        },
        amount:{type:Number,required:true},
        category:{type:String,required:true},
        date:{type:Date, required:true}
    },
    {timestamps:true}
);

const Expense = mongoose.model<IExpenses>("Expense",ExpensesSchema)

export default Expense