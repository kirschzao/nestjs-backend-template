import { PrismaClient } from '@prisma/client';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type Transaction = PrismaTransactionClient;

export class WithTransaction {
  tx: Transaction;
}

export abstract class TransactionAdapter {
  abstract transaction<R>(fn: (tx: Transaction) => Promise<R>): Promise<R>;
}
