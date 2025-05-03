import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDataBase from "./config/db";
import authrouter from './routes/authRouter';
import { expenseRoute } from './routes/expensesRoute';


dotenv.config()

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cors(
    {
        origin:true,
        credentials:true,
    }
));
app.use(cookieParser());


connectDataBase();

// api routes
app.use('/auth',authrouter)
app.use('/expense',expenseRoute)

// Routes testing the api
app.get('/', (req, res) => {
    res.send('API is running successfully. 😎');
});

app.listen(port, () => {
console.log(`Server running on port: ${port}`);
});