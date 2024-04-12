import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {SecurityService} from "../service/security.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private securityService: SecurityService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    const user = this.securityService.getUser();
    if (user.role) {
      return this.securityService.hasRole('USER');
    }
    return this.router.navigate(['/login']);
  }
}


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private securityService: SecurityService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    const user = this.securityService.getUser();
    if (user.role) {
      return this.securityService.hasRole('ADMIN');
    }
    return this.router.navigate(['/login']);
  }
}
