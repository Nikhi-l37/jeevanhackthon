import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/data/seed';

const prisma = new PrismaClient();

seedDatabase()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
