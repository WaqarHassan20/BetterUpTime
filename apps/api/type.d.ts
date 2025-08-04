import { Request } from "express";

// Extend Request to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
