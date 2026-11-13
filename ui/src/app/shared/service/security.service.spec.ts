import {TestBed} from '@angular/core/testing';
import {CookieService} from "ngx-cookie-service";
import {SecurityService} from "./security.service";
import {FakeCookieService, makeToken} from "../testing/fake-cookie.service";
import {environment} from "../../../environments/environment";

describe('SecurityService', () => {
  let service: SecurityService;
  let cookies: FakeCookieService;

  const nowInSeconds = () => Math.floor(Date.now() / 1000);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: CookieService, useClass: FakeCookieService}
      ]
    });
    service = TestBed.inject(SecurityService);
    cookies = TestBed.inject(CookieService) as unknown as FakeCookieService;
  });

  it('saveUser stores the user and marks the session as logged in', () => {
    const states: boolean[] = [];
    service.isLoggedIn$.subscribe(state => states.push(state));

    service.saveUser({username: 'john', role: 'USER'});

    expect(JSON.parse(cookies.get(service.AUTH_USER))).toEqual({username: 'john', role: 'USER'});
    expect(states.at(-1)).toBe(true);
  });

  it('getUser returns the stored user', () => {
    service.saveUser({username: 'john', role: 'ADMIN'});

    expect(service.getUser()).toEqual({username: 'john', role: 'ADMIN'});
  });

  it('getUser returns an empty object and logs out when nothing is stored', () => {
    service.isLoggedIn.next(true);

    expect(service.getUser()).toEqual({});
    expect(service.isLoggedIn.value).toBe(false);
  });

  it('hasRole compares against the stored role', () => {
    service.saveUser({username: 'john', role: 'ADMIN'});

    expect(service.hasRole('ADMIN')).toBe(true);
    expect(service.hasRole('USER')).toBe(false);
  });

  it('hasRole is false without a stored user', () => {
    expect(service.hasRole('USER')).toBe(false);
  });

  it('clean removes the token and the user', () => {
    cookies.set(environment.AUTH_TOKEN, makeToken(nowInSeconds() + 600));
    service.saveUser({username: 'john', role: 'USER'});

    service.clean();

    expect(cookies.get(environment.AUTH_TOKEN)).toBe('');
    expect(cookies.get(service.AUTH_USER)).toBe('');
    expect(service.isLoggedIn.value).toBe(false);
  });

  it('tokenExpired is true when there is no token', () => {
    expect(service.tokenExpired()).toBe(true);
    expect(service.isLoggedIn.value).toBe(false);
  });

  it('tokenExpired is false for a valid token', () => {
    cookies.set(environment.AUTH_TOKEN, makeToken(nowInSeconds() + 600));

    expect(service.tokenExpired()).toBe(false);
    expect(service.isLoggedIn.value).toBe(true);
  });

  it('tokenExpired is true for an expired token and clears the session', () => {
    cookies.set(environment.AUTH_TOKEN, makeToken(nowInSeconds() - 60));
    service.saveUser({username: 'john', role: 'USER'});

    expect(service.tokenExpired()).toBe(true);
    expect(cookies.get(environment.AUTH_TOKEN)).toBe('');
    expect(cookies.get(service.AUTH_USER)).toBe('');
    expect(service.isLoggedIn.value).toBe(false);
  });
});
