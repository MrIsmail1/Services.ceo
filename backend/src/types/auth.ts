export interface PreAuthPayload {
  email: string;
  role: 'PRO' | 'CLIENT';
}
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'PRO' | 'CLIENT';
}
export interface SignOptionsAndSecret {
  secret: string;
  expiresIn: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
