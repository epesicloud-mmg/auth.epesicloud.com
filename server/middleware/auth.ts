import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwtService";

export interface AuthenticatedRequest extends Request {
  clientId?: string;
  scope?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const decoded = await jwtService.verifyAccessToken(token);
    
    req.clientId = decoded.clientId;
    req.scope = decoded.scope;
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
