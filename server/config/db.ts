import mongoose from "mongoose";
import dontenv from 'dotenv'
import { error } from "console";

dontenv.config();


const connectDataBase = async () =>{
    try {
        if(!process.env.MONGODB_URL){
            throw error ('MONGODB_URI is not defined in .env file')
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL,{
            serverSelectionTimeoutMS:5000,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error:unknown) {
        console.error("Database connection error:")

        if(error instanceof Error){
            console.error(error.message);
        }else{
            console.error("Unknown error occured")
        };

        process.exit(1);
    }
}

export default connectDataBase