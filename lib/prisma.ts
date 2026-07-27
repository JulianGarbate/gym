import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

// On serverless platforms (e.g. Vercel) the deployment filesystem is
// read-only outside of /tmp. If DATABASE_URL points at /tmp, seed it from
// the bundled public/seed.db on cold start so the app has data to read.
const dbUrl = process.env.DATABASE_URL ?? '';
if (dbUrl.startsWith('file:/tmp/')) {
  const dbPath = dbUrl.replace('file:', '');
  const seedPath = path.join(process.cwd(), 'public', 'seed.db');
  if (!fs.existsSync(dbPath) && fs.existsSync(seedPath)) {
    fs.copyFileSync(seedPath, dbPath);
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
