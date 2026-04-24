"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PRODUCTS_BY_CATEGORY = {
    'Váy': [
        {
            name: "Váy Chữ A ZARA Linen Midi",
            description: 'Váy chữ A chất liệu lanh mềm mại, phù hợp đi làm và dạo phố.',
            basePrice: 1290000,
            discountPrice: 990000,
            img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Be', stockQuantity: 15, sku: 'VAY-ZRA-BE-S' },
                { size: 'M', color: 'Be', stockQuantity: 20, sku: 'VAY-ZRA-BE-M' },
                { size: 'L', color: 'Đen', stockQuantity: 12, sku: 'VAY-ZRA-BK-L' },
            ],
        },
        {
            name: 'Váy Xếp Ly H&M Pleated',
            description: 'Váy xếp ly dáng dài, tôn vóc dáng thanh lịch cho phái nữ.',
            basePrice: 890000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Hồng Pastel', stockQuantity: 18, sku: 'VAY-HM-PK-S' },
                { size: 'M', color: 'Hồng Pastel', stockQuantity: 22, sku: 'VAY-HM-PK-M' },
            ],
        },
        {
            name: 'Váy Denim Uniqlo Classic',
            description: 'Váy jean Uniqlo dáng suông cổ điển, dễ phối đồ.',
            basePrice: 750000,
            discountPrice: 650000,
            img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Xanh Đậm', stockQuantity: 25, sku: 'VAY-UNQ-BL-S' },
                { size: 'M', color: 'Xanh Đậm', stockQuantity: 30, sku: 'VAY-UNQ-BL-M' },
                { size: 'L', color: 'Xanh Đậm', stockQuantity: 15, sku: 'VAY-UNQ-BL-L' },
            ],
        },
    ],
    'Đầm': [
        {
            name: 'Đầm Dạ Hội Mango Evening',
            description: 'Đầm dạ hội Mango phom ôm body, chất liệu satin sang trọng.',
            basePrice: 2190000,
            discountPrice: 1890000,
            img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Đỏ Rượu', stockQuantity: 8, sku: 'DAM-MNG-RD-S' },
                { size: 'M', color: 'Đỏ Rượu', stockQuantity: 10, sku: 'DAM-MNG-RD-M' },
                { size: 'M', color: 'Đen', stockQuantity: 12, sku: 'DAM-MNG-BK-M' },
            ],
        },
        {
            name: 'Đầm Maxi Forever 21 Floral',
            description: 'Đầm maxi họa tiết hoa nhí, dịu dàng nữ tính cho mùa hè.',
            basePrice: 1050000,
            discountPrice: 850000,
            img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Trắng Hoa', stockQuantity: 14, sku: 'DAM-F21-FL-S' },
                { size: 'M', color: 'Trắng Hoa', stockQuantity: 18, sku: 'DAM-F21-FL-M' },
            ],
        },
        {
            name: 'Đầm Công Sở Massimo Dutti',
            description: 'Đầm công sở cao cấp, dáng chữ A, phù hợp môi trường chuyên nghiệp.',
            basePrice: 2450000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'S', color: 'Navy', stockQuantity: 10, sku: 'DAM-MSD-NV-S' },
                { size: 'M', color: 'Navy', stockQuantity: 12, sku: 'DAM-MSD-NV-M' },
                { size: 'L', color: 'Navy', stockQuantity: 8, sku: 'DAM-MSD-NV-L' },
            ],
        },
    ],
    'Áo Thun': [
        {
            name: 'Áo Thun Nam Uniqlo AIRism Cotton',
            description: 'Áo thun cotton AIRism Uniqlo, thấm hút mồ hôi, mặc siêu mát.',
            basePrice: 390000,
            discountPrice: 320000,
            img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'M', color: 'Trắng', stockQuantity: 40, sku: 'ATN-UNQ-WH-M' },
                { size: 'L', color: 'Trắng', stockQuantity: 35, sku: 'ATN-UNQ-WH-L' },
                { size: 'XL', color: 'Đen', stockQuantity: 30, sku: 'ATN-UNQ-BK-XL' },
            ],
        },
        {
            name: 'Áo Thun Nam Adidas Essentials Logo',
            description: 'Áo thun Adidas in logo Trefoil cổ điển, chất liệu cotton 100%.',
            basePrice: 650000,
            discountPrice: 550000,
            img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'M', color: 'Đen', stockQuantity: 25, sku: 'ATN-ADI-BK-M' },
                { size: 'L', color: 'Đen', stockQuantity: 30, sku: 'ATN-ADI-BK-L' },
                { size: 'L', color: 'Trắng', stockQuantity: 20, sku: 'ATN-ADI-WH-L' },
            ],
        },
        {
            name: 'Áo Thun Nam Nike Dri-FIT Run',
            description: 'Áo thun thể thao Nike Dri-FIT, thoáng khí, chuyên dụng cho chạy bộ.',
            basePrice: 890000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'M', color: 'Xanh Navy', stockQuantity: 22, sku: 'ATN-NIK-NV-M' },
                { size: 'L', color: 'Xanh Navy', stockQuantity: 18, sku: 'ATN-NIK-NV-L' },
            ],
        },
        {
            name: 'Áo Thun Nam Champion Heritage',
            description: 'Áo thun Champion cổ điển, form rộng streetwear, logo thêu phía ngực.',
            basePrice: 720000,
            discountPrice: 620000,
            img: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'L', color: 'Xám', stockQuantity: 18, sku: 'ATN-CHM-GR-L' },
                { size: 'XL', color: 'Xám', stockQuantity: 15, sku: 'ATN-CHM-GR-XL' },
            ],
        },
    ],
    'Quần Jean': [
        {
            name: "Quần Jean Nam Levi's 501 Original",
            description: "Quần jean Levi's 501 huyền thoại, form suông cổ điển chuẩn Mỹ.",
            basePrice: 1890000,
            discountPrice: 1590000,
            img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '30', color: 'Xanh Đậm', stockQuantity: 15, sku: 'QJN-LVS-BL-30' },
                { size: '32', color: 'Xanh Đậm', stockQuantity: 20, sku: 'QJN-LVS-BL-32' },
                { size: '34', color: 'Xanh Đậm', stockQuantity: 12, sku: 'QJN-LVS-BL-34' },
            ],
        },
        {
            name: "Quần Jean Nam Wrangler Texas",
            description: 'Quần jean Wrangler Texas, form straight, chất denim dày dặn bền bỉ.',
            basePrice: 1350000,
            discountPrice: 1150000,
            img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '30', color: 'Xanh Nhạt', stockQuantity: 14, sku: 'QJN-WRG-LB-30' },
                { size: '32', color: 'Xanh Nhạt', stockQuantity: 16, sku: 'QJN-WRG-LB-32' },
            ],
        },
        {
            name: 'Quần Jean Nam H&M Slim Fit',
            description: 'Quần jean H&M Slim Fit, ôm vừa phải, phong cách trẻ trung hiện đại.',
            basePrice: 790000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '30', color: 'Đen', stockQuantity: 20, sku: 'QJN-HM-BK-30' },
                { size: '32', color: 'Đen', stockQuantity: 25, sku: 'QJN-HM-BK-32' },
                { size: '34', color: 'Đen', stockQuantity: 15, sku: 'QJN-HM-BK-34' },
            ],
        },
        {
            name: 'Quần Jean Nam Calvin Klein Skinny',
            description: 'Quần jean Calvin Klein dáng Skinny ôm dáng, trẻ trung và năng động.',
            basePrice: 1650000,
            discountPrice: 1450000,
            img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '30', color: 'Xanh Xước', stockQuantity: 10, sku: 'QJN-CK-BL-30' },
                { size: '32', color: 'Xanh Xước', stockQuantity: 12, sku: 'QJN-CK-BL-32' },
            ],
        },
    ],
    'Túi Xách': [
        {
            name: 'Túi Xách Charles & Keith Mini Tote',
            description: 'Túi tote mini Charles & Keith chất liệu da PU cao cấp, thiết kế tối giản.',
            basePrice: 1590000,
            discountPrice: 1290000,
            img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'Free Size', color: 'Đen', stockQuantity: 20, sku: 'TX-CK-BK-FR' },
                { size: 'Free Size', color: 'Be', stockQuantity: 15, sku: 'TX-CK-BE-FR' },
            ],
        },
        {
            name: 'Túi Xách Michael Kors Jet Set',
            description: 'Túi xách Michael Kors Jet Set, logo MK nổi bật, da saffiano sang trọng.',
            basePrice: 4950000,
            discountPrice: 4290000,
            img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'Free Size', color: 'Nâu', stockQuantity: 8, sku: 'TX-MK-BR-FR' },
                { size: 'Free Size', color: 'Đen', stockQuantity: 10, sku: 'TX-MK-BK-FR' },
            ],
        },
        {
            name: 'Túi Đeo Chéo Coach Tabby',
            description: 'Túi đeo chéo Coach Tabby, khóa đồng đặc trưng, phong cách vintage.',
            basePrice: 6890000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'Free Size', color: 'Nâu Cognac', stockQuantity: 6, sku: 'TX-CO-CG-FR' },
            ],
        },
        {
            name: 'Balo MLB Monogram',
            description: 'Balo MLB họa tiết monogram, phong cách thể thao đường phố Hàn Quốc.',
            basePrice: 1890000,
            discountPrice: 1590000,
            img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: 'Free Size', color: 'Đen', stockQuantity: 18, sku: 'TX-MLB-BK-FR' },
                { size: 'Free Size', color: 'Be', stockQuantity: 14, sku: 'TX-MLB-BE-FR' },
            ],
        },
    ],
    'Giày': [
        {
            name: 'Giày Adidas Ultraboost 22',
            description: 'Giày chạy bộ Adidas Ultraboost 22, đế Boost êm ái, công nghệ Primeknit.',
            basePrice: 4890000,
            discountPrice: 3990000,
            img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '40', color: 'Đen', stockQuantity: 12, sku: 'GIAY-ADI-UB-BK-40' },
                { size: '41', color: 'Đen', stockQuantity: 15, sku: 'GIAY-ADI-UB-BK-41' },
                { size: '42', color: 'Trắng', stockQuantity: 10, sku: 'GIAY-ADI-UB-WH-42' },
                { size: '43', color: 'Trắng', stockQuantity: 8, sku: 'GIAY-ADI-UB-WH-43' },
            ],
        },
        {
            name: 'Giày Nike Air Force 1 Low',
            description: 'Giày Nike Air Force 1 Low phiên bản trắng toàn thân, biểu tượng sneaker.',
            basePrice: 2990000,
            discountPrice: 2690000,
            img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '39', color: 'Trắng', stockQuantity: 18, sku: 'GIAY-NIK-AF1-WH-39' },
                { size: '40', color: 'Trắng', stockQuantity: 25, sku: 'GIAY-NIK-AF1-WH-40' },
                { size: '41', color: 'Trắng', stockQuantity: 20, sku: 'GIAY-NIK-AF1-WH-41' },
                { size: '42', color: 'Trắng', stockQuantity: 15, sku: 'GIAY-NIK-AF1-WH-42' },
            ],
        },
        {
            name: 'Giày Converse Chuck Taylor 1970s',
            description: 'Giày Converse Chuck Taylor 1970s cổ cao, thiết kế cổ điển không lỗi mốt.',
            basePrice: 1890000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '38', color: 'Đen', stockQuantity: 15, sku: 'GIAY-CVS-CT-BK-38' },
                { size: '39', color: 'Đen', stockQuantity: 20, sku: 'GIAY-CVS-CT-BK-39' },
                { size: '40', color: 'Trắng', stockQuantity: 18, sku: 'GIAY-CVS-CT-WH-40' },
                { size: '41', color: 'Trắng', stockQuantity: 12, sku: 'GIAY-CVS-CT-WH-41' },
            ],
        },
        {
            name: 'Giày Vans Old Skool Classic',
            description: 'Giày Vans Old Skool sọc trắng đặc trưng, phong cách skater cá tính.',
            basePrice: 1650000,
            discountPrice: 1390000,
            img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '39', color: 'Đen-Trắng', stockQuantity: 16, sku: 'GIAY-VAN-OS-BW-39' },
                { size: '40', color: 'Đen-Trắng', stockQuantity: 22, sku: 'GIAY-VAN-OS-BW-40' },
                { size: '41', color: 'Đen-Trắng', stockQuantity: 18, sku: 'GIAY-VAN-OS-BW-41' },
            ],
        },
        {
            name: 'Giày Dr. Martens 1460 Boots',
            description: 'Bốt Dr. Martens 1460 cao cổ, da bóng, bền bỉ theo thời gian.',
            basePrice: 4590000,
            discountPrice: null,
            img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=85&auto=format&fit=crop',
            variants: [
                { size: '40', color: 'Nâu', stockQuantity: 8, sku: 'GIAY-DRM-BT-BR-40' },
                { size: '41', color: 'Nâu', stockQuantity: 10, sku: 'GIAY-DRM-BT-BR-41' },
            ],
        },
    ],
};
async function main() {
    console.log('🌱 Bắt đầu seed sản phẩm theo danh mục...\n');
    const categories = await prisma.category.findMany();
    const catMap = new Map();
    for (const c of categories)
        catMap.set(c.name.toLowerCase().trim(), c.id);
    let totalProducts = 0;
    let totalVariants = 0;
    const missing = [];
    for (const [catName, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
        const categoryId = catMap.get(catName.toLowerCase().trim());
        if (!categoryId) {
            missing.push(catName);
            console.warn(`  ⚠️  Bỏ qua — không tìm thấy danh mục "${catName}"`);
            continue;
        }
        console.log(`📦 Danh mục "${catName}" (id=${categoryId})`);
        for (const p of products) {
            const { variants, ...productInfo } = p;
            const existing = await prisma.product.findFirst({
                where: { name: productInfo.name, categoryId },
            });
            const product = existing
                ? await prisma.product.update({
                    where: { id: existing.id },
                    data: productInfo,
                })
                : await prisma.product.create({
                    data: { ...productInfo, categoryId },
                });
            for (const v of variants) {
                await prisma.productVariant.upsert({
                    where: { sku: v.sku },
                    update: { ...v, productId: product.id },
                    create: { ...v, productId: product.id },
                });
                totalVariants++;
            }
            totalProducts++;
            console.log(`   ✓ ${product.name} (${variants.length} biến thể)`);
        }
        console.log('');
    }
    console.log(`\n✅ Hoàn tất: ${totalProducts} sản phẩm, ${totalVariants} biến thể.`);
    if (missing.length) {
        console.log(`\n⚠️  Các danh mục không có trong DB: ${missing.join(', ')}`);
        console.log('    Vui lòng tạo chúng trước trong trang Admin > Danh mục, sau đó chạy lại.');
    }
}
main()
    .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-products.js.map