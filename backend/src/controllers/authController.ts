import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/db.ts";
import { generateToken } from "../utils/generateToken.ts";

// Verifies Google ID tokens. No client secret needed — verification only checks
// Google's signature and that the token was minted for one of our client IDs.
const googleClient = new OAuth2Client();

export const googleAuth = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { idToken } = req.body;

  // The token's `aud` claim is whichever client requested it (iOS app or web),
  // so we accept any of our own client IDs as a valid audience.
  const audience = [
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
    // add GOOGLE_ANDROID_CLIENT_ID here when the Android client is enabled
  ].filter((id): id is string => Boolean(id));

  if (audience.length === 0) {
    return res
      .status(500)
      .json({ message: "Google sign-in is not configured" });
  }

  // 1. Verify the IDtoken that was passed from the use-google-auth function ie form google really came from Google and was meant for us.
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: "Invalid Google token" });
  }

  if (!payload?.sub || !payload.email) {
    return res.status(401).json({ message: "Google account has no email" });
  }
  if (payload.email_verified === false) {
    return res
      .status(401)
      .json({ message: "Your Google email is not verified" });
  }

  const googleId = payload.sub;
  const email = payload.email;
  const firstName = payload.given_name ?? "";
  const lastName = payload.family_name ?? "";

  // 2. Find-or-create: match the Google id first, then an existing email
  //    account (link it), otherwise make a new passwordless user.
  let user = await prisma.user.findUnique({ where: { googleId } });
  if (!user) {
    const existing = await prisma.user.findUnique({ where: { email } });
    user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: { googleId },
        })
      : await prisma.user.create({
          data: { email, googleId, firstName, lastName },
        });
  }

  // 3. Issue our own JWT — identical to the email login response.
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
    message: "User Logged in Successfully",
  });
};

export const register = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(409).json({ errorMessage: "User already exists" });
  }

  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);

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

  // Accounts created through Google have no password — they must use Google.
  if (!user.password) {
    return res
      .status(401)
      .json({ message: "This account uses Google sign-in" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ errorMessage: "Invalid Email or Password" });
  }

  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
    message: "User Logged in Successfully",
  });
};

export const getMe = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
    message: "Current user",
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
