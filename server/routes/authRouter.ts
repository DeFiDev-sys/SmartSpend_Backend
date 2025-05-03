import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/UserModel";
import { generateResetToken, genToken } from "../funcs/token";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../middleware/sendResetEmail";
import authMiddleware from "../middleware/protect";

dotenv.config();

const authrouter = express.Router();

//Sign Up
const RegisterUser = async (req: Request, res: Response): Promise<string | any> => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." }).end();
    }

    const userExist = await User.findOne({ $or: [{ email }, { username }] });

    if (userExist) {
      if (userExist.email === email) {
        return res.status(400).json({ message: "The email used already exists." });
      } else if (userExist.username === username) {
        return res.status(400).json({ message: "Username used already exists." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashPassword,
    });

    const genUserToken = genToken(newUser._id);

    // console.log(`${newUser.username} has registered.`)

    return res.status(200).json({
      user: {
        _id: newUser._id.toString(),
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
        email: newUser.email,
        admin: newUser.admin,
      },
      token: genUserToken,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error. Failed to register." }).end();
  }
};

//Login User
const LoginUser = async (req: Request, res: Response): Promise<string | any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." }).end();
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." }).end();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials. Check Password or Email Used" }).end();
    }

    const genUserToken = genToken(user._id);

    // console.log(`${user.username} logged in`)

    return res.status(200).json({
      user: {
        _id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },
      token: genUserToken,
      message: user.admin === true ? "Welcome Back Admin.😎" : "Login successfully.🎈",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error. Failed to Login." }).end();
  }
};

//Request for new password
const RequestNewPassword = async (req: Request, res: Response): Promise<string | any> => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." }).end();
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." }).end();
    }

    const resetToken = generateResetToken(user._id);

    // console.log(resetToken);

    await sendPasswordResetEmail(user.email, resetToken, user.username);

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Server error during setting new password" });
  }
};

//reset password save
const ResetPassword = async (req: Request, res: Response): Promise<string | any> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." }).end();
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as jwt.JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." }).end();
    }

    const tokenAlreadyUsed = user.usedResetTokens.some((useToken) => useToken.token === token);

    if (tokenAlreadyUsed) {
      return res.status(400).json({ message: "Reset token has already been used." }).end();
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.usedResetTokens.push({ token, usedAt: new Date() });
    user.usedResetTokens = user.usedResetTokens.slice(-2);

    await user.save();
    return res.status(200).json({ message: "Password changed successful." });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Reset link has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid reset link" });
    }
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Server error during setting new password" });
  }
};

//for admin get all users
const GetAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ admin: false }).select("-password -admin -usedResetTokens");
    res.status(200).json(users);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error, failed to get users" });
    return;
  }
};

authrouter.route("/register").post(RegisterUser);
authrouter.route("/login").post(LoginUser);
authrouter.route("/request-new-password").post(RequestNewPassword);
authrouter.route("/reset-password").post(ResetPassword);

//admin
authrouter.route("/admin/get-users").get(authMiddleware, GetAllUsers);

export default authrouter;
