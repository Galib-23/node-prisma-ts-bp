import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validateData = SignUpSchema.parse(req.body);
  let user = await prismaClient.user.findFirst({
    where: {
      email: validateData.email,
    },
  });
  if (user) {
    next(
      new BadRequestException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXISTS,
      ),
    );
  }
  user = await prismaClient.user.create({
    data: {
      name: validateData.name,
      email: validateData.email,
      password: hashSync(validateData.password, 10),
    },
  });
  res.json(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw Error("User not found");
  }
  if (!compareSync(password, user.password)) {
    throw Error("Wrong Credentials");
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
  );

  res.json({ user, token });
};
