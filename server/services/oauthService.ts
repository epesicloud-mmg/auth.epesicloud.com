import { storage } from "../storage";
import { jwtService } from "./jwtService";
import type { OAuthTokenResponse, TransactionInitiateResponse, TransactionValidateResponse } from "@shared/schema";

class OAuthService {
  async generateAccessToken(
    clientId: string, 
    clientSecret: string, 
    scope: string
  ): Promise<OAuthTokenResponse> {
    // Verify client credentials
    const client = await storage.getClientByCredentials(clientId, clientSecret);
    
    if (!client) {
      throw new Error("Invalid client credentials");
    }

    if (!client.isActive) {
      throw new Error("Client is inactive");
    }

    if (client.scope !== scope) {
      throw new Error("Invalid scope for client");
    }

    // Generate JWT access token
    const accessToken = jwtService.generateAccessToken(clientId, scope);
    const expiresIn = jwtService.getTokenExpiry();

    // Store access token in database
    await storage.createAccessToken({
      token: accessToken,
      clientId,
      scope,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });

    // Update client last activity
    await storage.updateClientActivity(clientId);

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: expiresIn,
    };
  }

  async generateTransactionToken(clientId: string): Promise<TransactionInitiateResponse> {
    // Verify client exists and is active
    const client = await storage.getClientById(clientId);
    
    if (!client) {
      throw new Error("Invalid client");
    }

    if (!client.isActive) {
      throw new Error("Client is inactive");
    }

    if (client.scope !== "initiate_transaction") {
      throw new Error("Client does not have permission to initiate transactions");
    }

    // Generate transaction token (expires in 10 minutes)
    const transactionToken = await storage.createTransactionToken({
      clientId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Create transaction record
    await storage.createTransaction({
      transactionToken: transactionToken.token,
      initiatorClientId: clientId,
      status: "initiated",
    });

    return {
      transaction_token: transactionToken.token,
    };
  }

  async validateTransactionToken(token: string): Promise<TransactionValidateResponse> {
    const transactionToken = await storage.getTransactionToken(token);
    
    if (!transactionToken) {
      throw new Error("Invalid transaction token");
    }

    if (transactionToken.isUsed) {
      throw new Error("Transaction token has already been used");
    }

    if (new Date() > transactionToken.expiresAt) {
      throw new Error("Transaction token has expired");
    }

    // Mark token as used
    await storage.markTransactionTokenAsUsed(token);

    // Update transaction status
    await storage.updateTransactionStatus(token, "validated");

    return {
      valid: true,
      transaction_token: token,
      client_id: transactionToken.clientId,
    };
  }
}

export const oauthService = new OAuthService();
