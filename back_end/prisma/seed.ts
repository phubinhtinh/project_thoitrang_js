import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Tạo tài khoản Admin mặc định
  const adminEmail = 'admin@shopthoitrang.com';
  const adminPassword = 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      fullName: 'Quản trị viên',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  });

  // 2. Tạo danh mục (Categories)
  const catNu = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Nữ',
      description: 'Thời trang nữ cao cấp',
    },
  });

  const catNam = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Nam',
      description: 'Thời trang nam thanh lịch',
    },
  });

  const catPhuKien = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Phụ kiện',
      description: 'Phụ kiện thời trang tinh tế',
    },
  });

  // 3. Tạo sản phẩm mẫu (Products)
  const productsData = [
    {
      id: 1,
      categoryId: catNu.id,
      name: 'Archetype Tailored Coat',
      description: 'Áo khoác dạ dáng dài thiết kế cao cấp, chất liệu len cừu tự nhiên.',
      basePrice: 2450000,
      discountPrice: 2100000,
      variants: [
        { size: 'S', color: 'Charcoal', stockQuantity: 10, sku: 'ATC-CHR-S', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD34Hoot6kuc2n5W4toHcu26APTR-6GpiyGeJy-HukfuwwceQnOWFWTlwZHkBm5RtSAoNX_DeWCvAE-7CEOFFDOUIPvdK_VH9FPhu1pIR6tDkpZQzl49Nubju4reXIDDKH_IceN_ckMbCRbHYDBsj-Vb-fLLGnZ4toaV8a3t89et2TUSlguOiCXnCfvCTlO4ILobNT0uC7D3l-vCVHXNRFZHsG6YxJveQa1jD3TbaTCmg3P8u-gzmC2P3ZrAzpk3CXjUpAvy5-kcdWn' },
        { size: 'M', color: 'Charcoal', stockQuantity: 15, sku: 'ATC-CHR-M' },
        { size: 'L', color: 'Charcoal', stockQuantity: 5, sku: 'ATC-CHR-L' },
      ],
    },
    {
      id: 2,
      categoryId: catPhuKien.id,
      name: 'Sculptural Tote',
      description: 'Túi tote da thật với thiết kế hình học tối giản.',
      basePrice: 1650000,
      discountPrice: null,
      variants: [
        { size: 'One Size', color: 'Black', stockQuantity: 20, sku: 'ST-BLK-OS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoOdd9lrBKdkmd58gglt6yZsU-OPm97koV54SCdrVFoF90bfCeP5pnq1-sjsYITO_EXrVnoLn6UO38-MUmNabh-8mVus2t1_yARkKcuPCZxYBe8ep1HSKS8OQZ7zWRQR18x683O36H6z04jM2d_JdJJ6M655Jy5mrXPVPnEQ1bIodtY9QeRw6pDLrS5oH_I_Bp4y3KlGFGJ9GabR79XRLDZH5RrUrO3cI0IJlQR6YuqHEkwOzdcX3xsN-kgV_M1-TQAMM7npew-KR5' },
      ],
    },
    {
      id: 3,
      categoryId: catNu.id,
      name: 'Silk Utility Trouser',
      description: 'Quần tây lụa mềm mại với thiết kế túi hộp hiện đại.',
      basePrice: 1150000,
      discountPrice: 950000,
      variants: [
        { size: 'S', color: 'Cream', stockQuantity: 12, sku: 'SUT-CRM-S', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8mGMW7xv8rGWFos20ni2ifOySnivoK-w02U-jYkwiXKgzLylzQaLbz0qfSoStaTcPwWkx6vuI7Eb64CQD8Y_P6slxwxjU2LAMODkAP9gT8tfNXzueOzpdEOhlURsowfP9lqz8U_N6fE9pq_nfaKQMhjjQNhkDLm-sgJDkKL-E3jcSPsc7yrT8FU75f3ANJxqIZL6in17QGen9ca5kQTgjxDIdKB0Ixn4_rOWhlBmcnyoIuHfOX21UMT4lXFGBkDIIVVxEMFwDkP16' },
        { size: 'M', color: 'Cream', stockQuantity: 10, sku: 'SUT-CRM-M' },
      ],
    },
    {
      id: 4,
      categoryId: catNam.id,
      name: 'Ribbed Merino Knit',
      description: 'Áo len Merino dệt gân cao cấp, giữ ấm tốt và thoáng khí.',
      basePrice: 890000,
      discountPrice: null,
      variants: [
        { size: 'M', color: 'Grey', stockQuantity: 18, sku: 'RMK-GRY-M', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdXbvB7fJ7XkkcDmR4BJVrm7GetDO1fHv-drznRYB678ObASW1qNs-OSn8SQFIz6UaQDXgRDUBivKMTi7TF2rOLDkLE1GNoYfqIez0B1gArLd3s6Qr8rfAr4y-HbBCoZ4W2fUDEVmaqS3B35RkXWqOOqjWKjGA96o_Vn7s5jlnFt6Hdxl5Y7hFWQL06ZHjpjMY60ZmV_C68PRs2OQqETNPoOH7Y3tLkwDLiL_VA5xDwS8z2s7dGu30jLdGvr1pw5m5iN3ofKmC5wXb' },
        { size: 'L', color: 'Grey', stockQuantity: 15, sku: 'RMK-GRY-L' },
        { size: 'XL', color: 'Grey', stockQuantity: 10, sku: 'RMK-GRY-XL' },
      ],
    },
    {
      id: 5,
      categoryId: catNam.id,
      name: 'Structured Wool Overcoat',
      description: 'Áo khoác dạ nam cấu trúc sắc sảo, phong cách tối giản.',
      basePrice: 1450000,
      discountPrice: 1250000,
      variants: [
        { size: 'M', color: 'Anthracite', stockQuantity: 8, sku: 'SWO-ANT-M', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAv_Xuo7-KdAQNHiPYZWgE0cLrdz7U4_ZrAkHwjnNRwlDtVrZhYe5tuoO9oUo0esSOLICgLATd4rLc297fch_3yibrsYLEtK_n_zUIhB6p8UL3-3K15YmII1DHE_NowRp5O-c6MzwZggDYWoSijYrmp30Qlf1tY0eKcbSrty67IL_v8OqKpIj7Hx6te3dUPH6kmHXxB4oWX_7SS9SrQ6xEniBP7W7CMRIxgti4EqYlmntMJdsxNvhYFPSi_so8iOuL1rC_LQK5nxFE' },
        { size: 'L', color: 'Anthracite', stockQuantity: 12, sku: 'SWO-ANT-L' },
      ],
    },
  ];

  for (const product of productsData) {
    const { variants, ...productInfo } = product;
    await prisma.product.upsert({
      where: { id: product.id },
      update: productInfo,
      create: productInfo,
    });

    for (const variant of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: variant,
        create: {
          ...variant,
          productId: product.id,
        },
      });
    }
  }

  console.log('✅ Seed dữ liệu thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
