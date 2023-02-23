import "../../../loadEnvironment.js";
import bcrypt from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import {
  type UserStructure,
  type CustomJwtPayload,
  type UserCredentials,
} from "../../../types";
import jwt from "jsonwebtoken";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    const customError = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );

    next(customError);

    return;
  }

  const jwtPayload: CustomJwtPayload = {
    sub: user?._id.toString(),
    username: user.username,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

  res.status(200).json({ token });
};

export const createUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    const avatar = req.file!.originalname;

    const hashedpassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedpassword,
      username,
      avatar,
    });

    res.status(201).json({ message: "The user has been created" });
  } catch (error) {
    const customError = new CustomError(
      "There was a problem registering the user",
      400,
      "Something went wrong"
    );
    next(customError);
  }
};
