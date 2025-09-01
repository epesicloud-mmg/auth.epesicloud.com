import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ACCESS_TOKEN_EXPIRY = "1h";

interface AccessTokenPayload {
  clientId: string;
  scope: string;
  type: "access_token";
}

class JwtService {
  generateAccessToken(clientId: string, scope: string): string {
    const payload: AccessTokenPayload = {
      clientId,
      scope,
      type: "access_token",
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: "authvault",
      audience: "authvault-api",
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: "authvault",
        audience: "authvault-api",
      }) as AccessTokenPayload;

      if (decoded.type !== "access_token") {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  getTokenExpiry(): number {
    return 3600; // 1 hour in seconds
  }
}

export const jwtService = new JwtService();
