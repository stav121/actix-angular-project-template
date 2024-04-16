import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../environments/environment";
import {jwtDecode} from "jwt-decode";


/** Security service, handles JWT */
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  /** Logged in observable */
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  /* Cookie names */
  public AUTH_TOKEN: string;
  public AUTH_USER: string = 'auth-user';

  constructor(private cookieService: CookieService) {
    this.AUTH_TOKEN = environment.AUTH_TOKEN;
  }

  public saveUser(user: any): void {
    this.cookieService.set(this.AUTH_USER, JSON.stringify(user));
    this.isLoggedIn.next(true);
  }

  public getUser(): any {
    const user = this.cookieService.get(this.AUTH_USER);
    if (user === null || user === undefined || user === '') {
      this.isLoggedIn.next(false);
      return {};
    }
    return JSON.parse(user);
  }

  public hasRole(role: string): boolean {
    return this.getUser().role == role;
  }

  public clean(): void {
    this.cookieService.delete(this.AUTH_TOKEN);
    this.cookieService.delete(this.AUTH_USER);
    this.isLoggedIn.next(false);
  }

  public tokenExpired(): boolean {
    let token: any = this.cookieService.get(this.AUTH_TOKEN);
    if (token === null || token === undefined || token === '') {
      this.isLoggedIn.next(false);
      return true;
    }
    token = jwtDecode(token);
    if ((Math.floor((new Date).getTime() / 1000)) >= token.exp) {
      this.clean();
      return true;
    }
    this.isLoggedIn.next(true);
    return false;
  }
}
