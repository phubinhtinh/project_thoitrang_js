import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Danh sách các bảng có cột id auto-increment cần reset sequence
const TABLES = [
  'users',
  'categories',
  'products',
  'product_variants',
  'orders',
  'order_items',
  'cart_items',
  'reviews',
];

async function main() {
  for (const table of TABLES) {
    try {
      const result = await prisma.$queryRawUnsafe<{ setval: bigint }[]>(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'),
                       COALESCE((SELECT MAX(id) FROM "${table}"), 1),
                       (SELECT MAX(id) FROM "${table}") IS NOT NULL);`,
      );
      console.log(`✓ ${table}: sequence reset to ${result[0]?.setval ?? 'N/A'}`);
    } catch (err: any) {
      console.error(`✗ ${table}: ${err.message}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
