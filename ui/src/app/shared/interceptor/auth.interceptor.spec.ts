import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {authInterceptor} from "./auth.interceptor";

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('sends requests with credentials', () => {
    http.get('/api/auth/profile').subscribe();

    const req = httpTesting.expectOne('/api/auth/profile');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('keeps the rest of the request unchanged', () => {
    http.post('/api/auth/login', {identifier: 'john'}).subscribe();

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({identifier: 'john'});
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });
});
