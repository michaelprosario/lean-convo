export interface ITokenService {
  sign(payload: Record<string, unknown>): string;
}

export const TOKEN_SERVICE = 'ITokenService';
