-- AlterTable
ALTER TABLE `product_variants` ADD COLUMN `img` TEXT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `img` TEXT NULL;
