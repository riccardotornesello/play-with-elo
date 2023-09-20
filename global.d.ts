import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  var mongoose: any;
}
