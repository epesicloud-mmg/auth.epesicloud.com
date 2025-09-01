import { 
  users, clients, accessTokens, transactionTokens, transactions, apiLogs,
  type User, type InsertUser, type Client, type InsertClient, 
  type AccessToken, type TransactionToken, type Transaction, type ApiLog,
  type DashboardStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Client methods
  getAllClients(userId: number): Promise<Client[]>;
  getClientById(clientId: string): Promise<Client | undefined>;
  getClientByCredentials(clientId: string, clientSecret: string): Promise<Client | undefined>;
  createClient(insertClient: InsertClient & { userId: number }): Promise<Client>;
  updateClient(id: number, updates: Partial<Omit<Client, 'id' | 'clientId' | 'clientSecret' | 'createdAt'>>): Promise<Client>;
  deleteClient(id: number, userId: number): Promise<void>;
  updateClientActivity(clientId: string): Promise<void>;

  // Access token methods
  createAccessToken(accessToken: Omit<AccessToken, 'id' | 'createdAt'>): Promise<AccessToken>;

  // Transaction token methods
  createTransactionToken(transactionToken: Omit<TransactionToken, 'id' | 'token' | 'createdAt' | 'usedAt' | 'isUsed'>): Promise<TransactionToken>;
  getTransactionToken(token: string): Promise<TransactionToken | undefined>;
  markTransactionTokenAsUsed(token: string): Promise<void>;

  // Transaction methods
  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'>): Promise<Transaction>;
  updateTransactionStatus(transactionToken: string, status: string): Promise<void>;
  getRecentTransactions(userId: number, limit: number): Promise<Transaction[]>;

  // API logging
  logApiRequest(apiLog: Omit<ApiLog, 'id' | 'createdAt'>): Promise<void>;

  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllClients(userId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  }

  async getClientById(clientId: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.clientId, clientId));
    return client || undefined;
  }

  async getClientByCredentials(clientId: string, clientSecret: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(
      and(eq(clients.clientId, clientId), eq(clients.clientSecret, clientSecret))
    );
    return client || undefined;
  }

  async createClient(insertClient: InsertClient & { userId: number }): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async updateClient(id: number, updates: Partial<Omit<Client, 'id' | 'clientId' | 'clientSecret' | 'createdAt'>>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: number, userId: number): Promise<void> {
    await db.delete(clients).where(and(eq(clients.id, id), eq(clients.userId, userId)));
  }

  async updateClientActivity(clientId: string): Promise<void> {
    await db
      .update(clients)
      .set({ lastActivity: new Date() })
      .where(eq(clients.clientId, clientId));
  }

  async createAccessToken(accessToken: Omit<AccessToken, 'id' | 'createdAt'>): Promise<AccessToken> {
    const [token] = await db
      .insert(accessTokens)
      .values(accessToken)
      .returning();
    return token;
  }

  async createTransactionToken(transactionToken: Omit<TransactionToken, 'id' | 'token' | 'createdAt' | 'usedAt' | 'isUsed'>): Promise<TransactionToken> {
    const [token] = await db
      .insert(transactionTokens)
      .values(transactionToken)
      .returning();
    return token;
  }

  async getTransactionToken(token: string): Promise<TransactionToken | undefined> {
    const [transactionToken] = await db.select().from(transactionTokens).where(eq(transactionTokens.token, token));
    return transactionToken || undefined;
  }

  async markTransactionTokenAsUsed(token: string): Promise<void> {
    await db
      .update(transactionTokens)
      .set({ isUsed: true, usedAt: new Date() })
      .where(eq(transactionTokens.token, token));
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'>): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransactionStatus(transactionToken: string, status: string): Promise<void> {
    await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.transactionToken, transactionToken));
  }

  async getRecentTransactions(userId: number, limit: number): Promise<Transaction[]> {
    const result = await db
      .select({
        id: transactions.id,
        transactionToken: transactions.transactionToken,
        initiatorClientId: transactions.initiatorClientId,
        executorClientId: transactions.executorClientId,
        transactionData: transactions.transactionData,
        status: transactions.status,
        createdAt: transactions.createdAt,
        completedAt: transactions.completedAt,
      })
      .from(transactions)
      .innerJoin(clients, eq(transactions.initiatorClientId, clients.clientId))
      .where(eq(clients.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
    
    return result as Transaction[];
  }

  async logApiRequest(apiLog: Omit<ApiLog, 'id' | 'createdAt'>): Promise<void> {
    await db.insert(apiLogs).values(apiLog);
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Get active clients count for this user only
      const activeClientsResult = await db
        .select({ count: count() })
        .from(clients)
        .where(and(eq(clients.userId, userId), eq(clients.isActive, true)));

      // Get transactions today count for this user's clients only
      const transactionsTodayResult = await db
        .select({ count: count() })
        .from(transactions)
        .innerJoin(clients, eq(transactions.initiatorClientId, clients.clientId))
        .where(and(
          eq(clients.userId, userId),
          gte(transactions.createdAt, today)
        ));

      // Calculate success rate for this user's transactions only
      const totalTransactionsResult = await db
        .select({ count: count() })
        .from(transactions)
        .innerJoin(clients, eq(transactions.initiatorClientId, clients.clientId))
        .where(eq(clients.userId, userId));

      const completedTransactionsResult = await db
        .select({ count: count() })
        .from(transactions)
        .innerJoin(clients, eq(transactions.initiatorClientId, clients.clientId))
        .where(and(
          eq(clients.userId, userId),
          eq(transactions.status, 'completed')
        ));

      const totalCount = totalTransactionsResult[0]?.count || 0;
      const completedCount = completedTransactionsResult[0]?.count || 0;
      const successRate = totalCount > 0 
        ? ((completedCount / totalCount) * 100).toFixed(1) + '%'
        : '0.0%';

      // Calculate average response time from API logs for this user's clients only
      const avgResponseResult = await db
        .select({ avg: sql<number>`AVG(${apiLogs.responseTime})` })
        .from(apiLogs)
        .innerJoin(clients, eq(apiLogs.clientId, clients.clientId))
        .where(eq(clients.userId, userId));

      const avgResponse = avgResponseResult[0]?.avg ? Math.round(avgResponseResult[0].avg) + 'ms' : '0ms';

      return {
        activeClients: activeClientsResult[0]?.count || 0,
        transactionsToday: transactionsTodayResult[0]?.count || 0,
        successRate,
        avgResponse,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        activeClients: 0,
        transactionsToday: 0,
        successRate: '0.0%',
        avgResponse: '0ms',
      };
    }
  }
}

export const storage = new DatabaseStorage();