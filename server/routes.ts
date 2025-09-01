import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { z } from "zod";
import { authMiddleware } from "./middleware/auth";
import { requireAuth, hashPassword, verifyPassword } from "./middleware/sessionAuth";
import { rateLimiter } from "./middleware/rateLimiter";
import { jwtService } from "./services/jwtService";
import { oauthService } from "./services/oauthService";
import { insertClientSchema, loginSchema, registerSchema, type DashboardStats, type LoginRequest, type RegisterRequest, type AuthResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Add timing middleware first
  app.use((req, res, next) => {
    (req as any).startTime = Date.now();
    next();
  });

  // Rate limiting middleware
  app.use("/api", rateLimiter);

  // Authentication Routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body) as RegisterRequest;
      
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({
          error: "user_exists",
          message: "User with this email already exists"
        });
      }

      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({
          error: "username_taken",
          message: "Username is already taken"
        });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const newUser = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        role: "user"
      });

      if (!req.session) {
        req.session = {} as any;
      }
      req.session.userId = newUser.id;

      const response: AuthResponse = {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role
        },
        message: "Registration successful"
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "validation_error",
          message: "Invalid input data",
          details: error.errors
        });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({
        error: "registration_failed",
        message: "Failed to create account"
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body) as LoginRequest;

      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: "invalid_credentials",
          message: "Invalid email or password"
        });
      }

      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "invalid_credentials",
          message: "Invalid email or password"
        });
      }

      if (!req.session) {
        req.session = {} as any;
      }
      req.session.userId = user.id;

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        message: "Login successful"
      };

      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "validation_error",
          message: "Invalid input data",
          details: error.errors
        });
      }

      console.error("Login error:", error);
      res.status(500).json({
        error: "login_failed",
        message: "Login failed"
      });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({
            error: "logout_failed",
            message: "Failed to logout"
          });
        }
        
        res.clearCookie('connect.sid');
        res.json({ message: "Logout successful" });
      });
    } else {
      res.json({ message: "Logout successful" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!(req as any).session || !(req as any).session.userId) {
        return res.status(401).json({
          error: "not_authenticated",
          message: "Not logged in"
        });
      }

      const user = await storage.getUser((req as any).session.userId);
      if (!user || !user.isActive) {
        (req as any).session.destroy(() => {});
        return res.status(401).json({
          error: "invalid_session",
          message: "Session expired"
        });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        error: "fetch_user_failed",
        message: "Failed to fetch user data"
      });
    }
  });

  // OAuth token endpoint
  app.post("/api/oauth/token", async (req, res) => {
    try {
      const body = z.object({
        grant_type: z.literal("client_credentials"),
        client_id: z.string(),
        client_secret: z.string(),
        scope: z.enum(["initiate_transaction", "execute_transaction"]),
      }).parse(req.body);

      const tokenResponse = await oauthService.generateAccessToken(
        body.client_id,
        body.client_secret,
        body.scope
      );

      await storage.logApiRequest({
        endpoint: "/api/oauth/token",
        method: "POST",
        clientId: body.client_id,
        statusCode: 200,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });

      res.json(tokenResponse);
    } catch (error: any) {
      await storage.logApiRequest({
        endpoint: "/api/oauth/token",
        method: "POST",
        clientId: req.body?.client_id,
        statusCode: 401,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });
      res.status(401).json({ error: "Invalid client credentials" });
    }
  });

  // Transaction initiate endpoint
  app.post("/api/transaction/initiate", authMiddleware, async (req, res) => {
    try {
      const body = z.object({
        client_id: z.string(),
      }).parse(req.body);

      const tokenResponse = await oauthService.generateTransactionToken(body.client_id);

      await storage.logApiRequest({
        endpoint: "/api/transaction/initiate",
        method: "POST",
        clientId: body.client_id,
        statusCode: 200,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });

      res.json(tokenResponse);
    } catch (error: any) {
      await storage.logApiRequest({
        endpoint: "/api/transaction/initiate",
        method: "POST",
        clientId: req.body?.client_id,
        statusCode: 400,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });
      res.status(400).json({ error: error.message });
    }
  });

  // Transaction validate endpoint
  app.post("/api/transaction/validate", authMiddleware, async (req, res) => {
    try {
      const body = z.object({
        transaction_token: z.string(),
      }).parse(req.body);

      const validationResponse = await oauthService.validateTransactionToken(body.transaction_token);

      await storage.logApiRequest({
        endpoint: "/api/transaction/validate",
        method: "POST",
        clientId: validationResponse.client_id,
        statusCode: 200,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });

      res.json(validationResponse);
    } catch (error: any) {
      await storage.logApiRequest({
        endpoint: "/api/transaction/validate",
        method: "POST",
        clientId: null,
        statusCode: 400,
        responseTime: Date.now() - (req as any).startTime,
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || "",
      });
      res.status(400).json({ error: error.message });
    }
  });

  // Admin endpoints for client management (protected)
  app.get("/api/admin/clients", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const clients = await storage.getAllClients(userId);
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/admin/clients", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient({ ...clientData, userId });
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/admin/clients/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = z.object({
        name: z.string().optional(),
        scope: z.enum(["initiate_transaction", "execute_transaction"]).optional(),
        isActive: z.boolean().optional(),
      }).parse(req.body);

      const client = await storage.updateClient(id, updates);
      res.json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/clients/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).user.id;
      await storage.deleteClient(id, userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error("Stats endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Recent transactions endpoint
  app.get("/api/admin/transactions", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getRecentTransactions(userId, limit);
      res.json(transactions);
    } catch (error: any) {
      console.error("Transactions endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
