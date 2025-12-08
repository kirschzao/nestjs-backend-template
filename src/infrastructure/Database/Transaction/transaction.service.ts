import { Transaction, TransactionAdapter } from './transaction.adapter';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTransactionIntegration implements TransactionAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async transaction<R>(fn: (tx: Transaction) => Promise<R>): Promise<R> {
    return await this.prisma.$transaction(async (tx) => {
      return fn(tx as Transaction);
    });
  }
}
