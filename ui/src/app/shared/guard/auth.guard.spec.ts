import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {adminGuard, authGuard} from "./auth.guard";
import {SecurityService} from "../service/security.service";
import {FakeCookieService} from "../testing/fake-cookie.service";

describe('auth guards', () => {
  let securityService: SecurityService;
  let router: Router;

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const run = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {provide: CookieService, useClass: FakeCookieService}
      ]
    });
    securityService = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('redirects to /login when there is no user', () => {
      const result = run(authGuard);

      expect(result).toBeInstanceOf(UrlTree);
      expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    });

    it('allows a USER', () => {
      securityService.saveUser({role: 'USER'});

      expect(run(authGuard)).toBe(true);
    });

    it('blocks an ADMIN', () => {
      securityService.saveUser({role: 'ADMIN'});

      expect(run(authGuard)).toBe(false);
    });
  });

  describe('adminGuard', () => {
    it('redirects to /login when there is no user', () => {
      const result = run(adminGuard);

      expect(result).toBeInstanceOf(UrlTree);
      expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    });

    it('allows an ADMIN', () => {
      securityService.saveUser({role: 'ADMIN'});

      expect(run(adminGuard)).toBe(true);
    });

    it('blocks a USER', () => {
      securityService.saveUser({role: 'USER'});

      expect(run(adminGuard)).toBe(false);
    });
  });
});
