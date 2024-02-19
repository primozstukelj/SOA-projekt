export interface IJWTToken {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}
