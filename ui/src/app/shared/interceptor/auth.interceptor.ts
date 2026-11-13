import {HttpInterceptorFn} from "@angular/common/http";

/** Sends cookies (including the auth token) with every API request. */
export const authInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({withCredentials: true}));
