import { NextFunction, Request, Response } from "express"

import { SECRET_JWT_KEY } from "../config.js";

import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  username: string;
  email: string;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token

  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY!) as JWTPayload
    req.session.user = data
  } catch { }

  next()
}