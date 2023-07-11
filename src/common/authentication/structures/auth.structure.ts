export interface JtwPayload {
  sub: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UserAlmaPayload {
  almaId: string;
  username: string;
  email: string;
}
