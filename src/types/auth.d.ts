import "express";

declare module "express" {
  interface SessionData {
    user: null | {
      id: string;
      username: string;
      email: string;
    }
  }

  interface Request {
    session?: SessionData;
  }
}