import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import {
  CompareParams,
  CryptographyAdapter,
  HashParams,
} from '@/infrastructure/Criptography/cryptography.adapter';

@Injectable()
export class CryptographyIntegration implements CryptographyAdapter {
  async compare(params: CompareParams): Promise<boolean> {
    const { plainText, cryptographedText } = params;

    return await compare(plainText, cryptographedText);
  }

  async hash(params: HashParams): Promise<string> {
    const { plainText, hashSalt } = params;

    return await hash(plainText, hashSalt);
  }
}
