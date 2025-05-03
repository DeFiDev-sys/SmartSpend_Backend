import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const getTokenFromHeader = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    return authHeader?.startsWith('Bearer')? authHeader.split(' ')[1] : null
}


const authMiddleware = (req:Request,res:Response,next:NextFunction): void =>{
    const token = getTokenFromHeader(req) || req.cookies?.token;

    if(!token){
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as jwt.JwtPayload
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({message : "Invalid token"})
        return;
    }
}

export default authMiddleware