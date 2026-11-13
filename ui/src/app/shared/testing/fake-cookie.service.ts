/**
 * In-memory replacement for CookieService so tests do not depend on
 * document.cookie.
 */
export class FakeCookieService {
  private cookies = new Map<string, string>();

  public get(name: string): string {
    return this.cookies.get(name) ?? '';
  }

  public set(name: string, value: string): void {
    this.cookies.set(name, value);
  }

  public delete(name: string): void {
    this.cookies.delete(name);
  }
}

/** Builds an unsigned JWT with the given expiry (seconds since epoch). */
export function makeToken(exp: number): string {
  const encode = (value: object) => btoa(JSON.stringify(value))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${encode({alg: 'HS256', typ: 'JWT'})}.${encode({sub: 'user-1', exp})}.signature`;
}
