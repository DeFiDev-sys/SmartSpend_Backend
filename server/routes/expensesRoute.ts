import express,{Request,Response} from "express";
import Expense from "../models/ExpensesModel";
import authMiddleware from "../middleware/protect";
import { SortOptions } from "../types/definitions";
import mongoose from "mongoose";

const expenseRoute = express.Router()

//  Get Expenses Route function
const getExpenses = async (req:Request,res:Response) :Promise<string | any> =>{
    try {
      const {category,range,startDate,endDate,sort} = req.query;
      const query : any = {user : req.userId}
      
      
      if(category){
        query.category = category
      }

      if(startDate && endDate && typeof startDate === 'string' && typeof endDate === "string"){
        query.date = {$gte: new Date(startDate), $lte: new Date(endDate) }
      }

      if(range){
        const now = new Date();
        if(range === 'day'){
            const start = new Date(now.setHours(0, 0, 0, 0));
            const end = new Date(now.setHours(23, 59, 59, 999));
            query.date = { $gte: start, $lte: end };
        }else if (range === 'week'){
            const start = new Date(now)
            start.setDate(start.getDate()-start.getDay())
            const end = new Date(start)
            end.setDate(end.getDate() + 6);
            query.date = { $gte: start, $lte: end };
        }else if (range === 'month'){
            const start = new Date(now.getFullYear(),now.getMonth(), 1)
            const end = new Date(now.getFullYear(),now.getMonth() + 1, 0)
            query.date = {$gte:start, $lte:end}
        }
      }

      const sortOption : SortOptions = {
        date : -1 //Newest by default selection
      }

      if(sort === 'oldest'){
        sortOption.date = 1
      }
      if(sort === 'amount'){
        sortOption.date = -1
      }

      const expenses = await Expense.find(query).sort(sortOption)
      return res.status(200).json({expenses})
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error });
    }
};

//Create Expenses Route function
export const createExpenses = async (req:Request,res:Response) :Promise<string | any> =>{
    try {
        const {title,category,amount,date} = req.body;

        if(!title||!amount||!category){
            return res.status(400).json({message:"Invalid credentials, fill all details."})
        };
        
        const expenses = await Expense.create({
            user:req.userId,
            title,
            amount,
            category,
            date : date || new Date(),
        });
        return res.status(200).json(expenses)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'server error',error:error})
    }
};

// Update Expenses Route
export const upadteExpenses = async (req:Request,res:Response) : Promise<string|any> =>{
    try {
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid Expenses ID."})
        }

        const expenses = await Expense.findById(id);

        if(!expenses){
            return res.status(404).json({message:"Expenses not found."})
        }

        if(expenses?.user.toString() !== req.userId.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updatedExpenses = await Expense.findByIdAndUpdate(id,req.body,{new:true});

        return res.status(200).json({updatedExpenses})
    } catch (error) {
        return res.status(500).json({message:"server error", error:error})
    }
};

//Delete Expenses route
export const deleteExpenses = async (req:Request,res:Response):Promise <string | any> =>{
    try {
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid Expenses ID."})
        }

        const expenses = await Expense.findById(id);

        if(!expenses){
            return res.status(404).json({message:"Expenses not found."})
        }

        if(expenses?.user.toString() !== req.userId.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await Expense.findByIdAndDelete(id)

        return res.status(200).json({message:"Expenses Deleted Successfully"});

    } catch (error) {
        return res.status(500).json({message:"server error", error:error})
    }
}

expenseRoute.route('/get_expenses').get(authMiddleware,getExpenses);
expenseRoute.route('/create_expenses').post(authMiddleware,createExpenses);
expenseRoute.route('/update_expenses/:id').patch(authMiddleware,upadteExpenses);
expenseRoute.route('/delete_expenses/:id').delete(authMiddleware,deleteExpenses);

export {expenseRoute}