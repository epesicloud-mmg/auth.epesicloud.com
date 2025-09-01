import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import type { User } from "@shared/schema";
import session from "express-session";

export interface AuthenticatedRequest extends Request {
  user?: User;
  session: session.Session & Partial<session.SessionData> & {
    userId?: number;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is logged in via session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ 
        error: "authentication_required",
        message: "Please log in to access this resource" 
      });
    }

    // Get user from database
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isActive) {
      // Clear invalid session
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });
      return res.status(401).json({ 
        error: "invalid_session",
        message: "Session is invalid. Please log in again." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ 
      error: "authentication_error",
      message: "Authentication check failed" 
    });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Declare session types
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}