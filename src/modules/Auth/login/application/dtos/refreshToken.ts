export interface TokensResponseInterface {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseInterface extends TokensResponseInterface {
  userId: string;
}
