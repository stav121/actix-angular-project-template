import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

/**
 * Actuator API resources.
 *
 * @author Stavros Grigoriou <unix12@protonmail.com>
 */
@Injectable({
  providedIn: 'root'
})
export class ActuatorService {
  constructor(private http: HttpClient) {
  }

  public healthCheck(): Observable<any> {
    return this.http.get<any>(environment.API_URL + "actuator/health_check");
  }
}
