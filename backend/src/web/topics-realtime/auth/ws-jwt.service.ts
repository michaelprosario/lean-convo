import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';

export type WsAuthenticatedUser = {
  userId: string;
  email: string;
};

@Injectable()
export class WsJwtService {
  constructor(private readonly jwtService: JwtService) {}

  extractUser(client: Socket): WsAuthenticatedUser | null {
    const token = this.getToken(client);
    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(token);
      if (!payload?.sub || !payload?.email) {
        return null;
      }

      return {
        userId: payload.sub,
        email: payload.email,
      };
    } catch {
      return null;
    }
  }

  private getToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return this.stripBearerPrefix(authToken.trim());
    }

    const authorizationHeader = client.handshake.headers.authorization;
    if (typeof authorizationHeader === 'string' && authorizationHeader.trim()) {
      return this.stripBearerPrefix(authorizationHeader.trim());
    }

    return null;
  }

  private stripBearerPrefix(value: string): string {
    if (value.startsWith('Bearer ')) {
      return value.slice('Bearer '.length).trim();
    }

    return value;
  }
}
