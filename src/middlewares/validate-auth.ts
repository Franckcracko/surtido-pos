import { NextFunction, Request, Response } from "express"

export const validateAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.session?.user

  if (!user) {
    res.status(401).redirect('/')
    return
  }

  next()
}