import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { generateToken } from "../utils/generateToken.ts";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  // collecting this data now from the request ie what was requested to register the user
  const { email, password, firstName, lastName } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(409).json({ errorMessage: "User already exists" });
  }

  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);

  // creating the user after checking it doesn't exist and hashing the password
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "Success",
    message: "user registered",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
};

export const login = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid) {
    return res.status(401).json({ errorMessage: "Invalid Email or Password" });
  }

  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
    message: "User Logged in Successfully",
  });
};

export const logout = (_req: Request, res: Response): void => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({
    status: "success",
    message: "User Logout created Successfully",
  });
};

//authentication backend jwt
