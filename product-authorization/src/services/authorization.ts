export class AuthorizationService {
  constructor(private readonly config: { [key in string]: string }) {}

  verifyToken(token: string): boolean {
    return token === this.config.cookie;
  }

  decodeToken(token: string): string {
    return Buffer.from(token, 'base64').toString('utf8');
  }
}
