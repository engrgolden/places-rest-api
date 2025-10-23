// userService.ts
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { CustomError } from "../models/CustomErrors";
import User, { IUser } from "../models/user";

const jwt = require("jsonwebtoken");

dotenv.config();
const JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY as string;

export const getAllUsers = async () => {
  const users = await User.find({}, "-password");
  if (!users.length) {
    throw new CustomError("empty", 404);
  } else {
    return users.map((user) => user.toObject({ getters: true }));
  }
};

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  fileName: string;
}

export const registerUser = async ({
  name,
  email,
  password,
  fileName,
}: RegisterUserInput) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError(
      "User with email already exists, kindly login instead",
      409
    );
  } else {
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      fileName,
      password: hashedPassword,
      places: [],
    });
    await newUser.save();

    let token;
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_ENCRYPTION_KEY,
      { expiresIn: "1h" }
    );

    const newUserObject = newUser.toObject({ getters: true });
    return { id: newUserObject.id, email: newUserObject.email, token };
  }
};

interface LoginUserInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginUserInput) => {
  const existingUser: IUser | null = await User.findOne({ email }).select(
    "name places fileName password"
  );

  if (!existingUser) {
    throw new CustomError("Email not registered", 401);
  }
  let isValidPassword;
  isValidPassword = await bcrypt.compare(
    password,
    existingUser.password as string
  );
  if (!isValidPassword) {
    throw new CustomError("Incorrect password", 401);
  }

  const existingUserObject = existingUser.toObject({
    getters: true,
  });

  let token;
  token = jwt.sign(
    { userId: existingUserObject.id, email: existingUserObject.email },
    JWT_ENCRYPTION_KEY,
    { expiresIn: "1h" }
  );

  return {
    id: existingUserObject.id,
    email: existingUserObject.email,
    token,
  };
};
