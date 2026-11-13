import {inject} from "@angular/core";
import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {SecurityService} from "../service/security.service";

/**
 * Allows the route when the stored user has the given role. Without a stored
 * user, redirects to the login page.
 */
function hasRoleOrLogin(role: string): boolean | UrlTree {
  const securityService = inject(SecurityService);
  const user = securityService.getUser();
  if (user.role) {
    return securityService.hasRole(role);
  }
  return inject(Router).createUrlTree(['/login']);
}

export const authGuard: CanActivateFn = () => hasRoleOrLogin('USER');

export const adminGuard: CanActivateFn = () => hasRoleOrLogin('ADMIN');
