import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../secrets";
import { prismaClient } from "..";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract the token from the header
  // 2. If token not present, throw error unauthorized
  // 3. If token is present, verify the token and extract the payload
  // 4. Get the user from the payload
  // 5. Attach the user to the current req object

  const token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
  }
}

export default authMiddleware;