const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.findUnique({where: {email: 'admin@shopthoitrang.com'}});
  if (!user) {
    console.log('User not found in this DB');
    return;
  }
  console.log('User found:', user.email, user.role);
  const isValid = await bcrypt.compare('Admin@123456', user.password);
  console.log('Password is valid?', isValid);
}

test().finally(() => prisma.$disconnect());
