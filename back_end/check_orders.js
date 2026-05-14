const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function listOrders() {
  const orders = await p.order.findMany({
    include: {
      items: { include: { variant: { include: { product: { select: { id: true, name: true } } } } } },
      user: { select: { email: true } }
    },
    orderBy: { id: 'asc' }
  });

  orders.forEach(o => {
    console.log('---');
    console.log(`Don hang #${o.id} | KH: ${o.user?.email} | Trang thai: ${o.status} | Tong: ${o.totalPrice}`);
    o.items.forEach(i => console.log(`  -> SP: ${i.variant.product.name} (Variant #${i.productVariantId})`));
  });

  console.log(`\nTong cong: ${orders.length} don hang`);
}

listOrders().finally(() => p.$disconnect());
