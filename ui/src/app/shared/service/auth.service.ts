import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequest, RegistrationRequest} from "../model/auth.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  /** Call /auth/login [POST] to login the user */
  public login(body: LoginRequest): Observable<any> {
    return this.http.post<any>(
      environment.API_URL + "auth/login",
      body,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
      },
    );
  }

  /** Call /auth/register [POST] and register a new user */
  public register(body: RegistrationRequest): Observable<any> {
    return this.http.post(
      environment.API_URL + "auth/register",
      body,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    );
  }

  /** Call /auth/logout [POST] and sign the user out. */
  public logout(): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'auth/logout', {}, {withCredentials: true});
  }

  /** Call /auth/profile [GET] to retrieve the user's profile. */
  public profile(): Observable<any> {
    return this.http.get<any>(environment.API_URL + "auth/profile", {withCredentials: true});
  }
}
