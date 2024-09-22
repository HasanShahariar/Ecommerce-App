export class AuthModel {
  token: string;
  refreshToken: string;
  expiresIn: Date;
  JWToken:string;

  setAuth(auth: AuthModel) {
    this.token = auth.token;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
