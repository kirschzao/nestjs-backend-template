export interface CompareParams {
  plainText: string;
  cryptographedText: string;
}

export interface HashParams {
  plainText: string;
  hashSalt: number;
}

export abstract class CryptographyAdapter {
  abstract compare(params: CompareParams): Promise<boolean>;
  abstract hash(params: HashParams): Promise<string>;
}
