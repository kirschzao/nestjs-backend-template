export abstract class CookiesAdapter {
  abstract generateSignedCookies(userId: string): SignedCookies;
}

export interface SignedCookies {
  policy: string;
  signature: string;
  keyPairId: string;
  expires: Date;
}
