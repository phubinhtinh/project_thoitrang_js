const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  try {
    console.log('Attempting to delete product 29...');
    await prisma.product.delete({ where: { id: 29 } });
    console.log('Success!');
  } catch (e) {
    console.error('Failed to delete:');
    console.error(e.code, e.meta, e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
