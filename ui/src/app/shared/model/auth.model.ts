export class LoginRequest {
  public constructor(public identifier: string,
              public password?: string) {
  }
}

export class RegistrationRequest {
  public constructor(public username: string,
              public email: string,
              public password: string) {
  }
}
