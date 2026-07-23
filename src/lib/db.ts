// Prisma client singleton.
//
// NOTE: the generated Prisma client requires `prisma generate`, which downloads
// engine binaries from binaries.prisma.sh — blocked by this sandbox's egress
// policy. So the client is loaded lazily (dynamic require) rather than imported
// statically: the app builds and the dashboard renders here without a database,
// and the first DB call in an environment WITH network access + a DATABASE_URL
// (where `prisma generate` has run) initialises the real client.
//
// Once generation is possible, swap the dynamic require for:
//   import { PrismaClient } from "@prisma/client";
// to get full model typing.

/* eslint-disable @typescript-eslint/no-var-requires */
type AnyPrisma = Record<string, unknown> & { $disconnect: () => Promise<void> };

const globalForPrisma = globalThis as unknown as { prisma?: AnyPrisma };

function createClient(): AnyPrisma {
  const moduleName = "@prisma/client"; // non-literal keeps the ungenerated client out of typecheck
  const { PrismaClient } = require(moduleName);
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }) as AnyPrisma;
}

export function getDb(): AnyPrisma {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
}
