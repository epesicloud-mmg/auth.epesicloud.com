import { pgTable, text, serial, integer, boolean, timestamp, varchar, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  clientId: uuid("client_id").defaultRandom().notNull().unique(),
  clientSecret: uuid("client_secret").defaultRandom().notNull(),
  name: text("name").notNull(),
  scope: text("scope").notNull(), // 'initiate_transaction' or 'execute_transaction'
  isActive: boolean("is_active").default(true).notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity"),
});

export const accessTokens = pgTable("access_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  clientId: uuid("client_id").notNull(),
  scope: text("scope").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactionTokens = pgTable("transaction_tokens", {
  id: serial("id").primaryKey(),
  token: uuid("token").defaultRandom().notNull().unique(),
  clientId: uuid("client_id").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionToken: text("transaction_token").notNull(),
  initiatorClientId: uuid("initiator_client_id").notNull(),
  executorClientId: uuid("executor_client_id"),
  transactionData: jsonb("transaction_data"),
  status: text("status").notNull(), // 'initiated', 'validated', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const apiLogs = pgTable("api_logs", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  clientId: uuid("client_id"),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  accessTokens: many(accessTokens),
  transactionTokens: many(transactionTokens),
  initiatedTransactions: many(transactions, { relationName: "initiator" }),
  executedTransactions: many(transactions, { relationName: "executor" }),
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
}));

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  client: one(clients, {
    fields: [accessTokens.clientId],
    references: [clients.clientId],
  }),
}));

export const transactionTokensRelations = relations(transactionTokens, ({ one }) => ({
  client: one(clients, {
    fields: [transactionTokens.clientId],
    references: [clients.clientId],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  initiatorClient: one(clients, {
    fields: [transactions.initiatorClientId],
    references: [clients.clientId],
    relationName: "initiator",
  }),
  executorClient: one(clients, {
    fields: [transactions.executorClientId],
    references: [clients.clientId],
    relationName: "executor",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  clientId: true,
  clientSecret: true,
  userId: true,
  createdAt: true,
  lastActivity: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type AccessToken = typeof accessTokens.$inferSelect;
export type TransactionToken = typeof transactionTokens.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ApiLog = typeof apiLogs.$inferSelect;

// API response types
export type OAuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type TransactionInitiateResponse = {
  transaction_token: string;
};

export type TransactionValidateResponse = {
  valid: boolean;
  transaction_token: string;
  client_id: string;
};

export type DashboardStats = {
  activeClients: number;
  transactionsToday: number;
  successRate: string;
  avgResponse: string;
};

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
  message: string;
};
