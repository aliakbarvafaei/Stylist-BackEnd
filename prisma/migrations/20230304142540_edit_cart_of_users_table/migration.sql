/*
  Warnings:

  - The primary key for the `cart_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cartId` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Cart_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoUrl` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeShop` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_item` DROP FOREIGN KEY `Cart_Item_cartId_fkey`;

-- AlterTable
ALTER TABLE `cart_item` DROP PRIMARY KEY,
    DROP COLUMN `cartId`,
    DROP COLUMN `id`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `productId`);

-- AlterTable
ALTER TABLE `seller` ADD COLUMN `logoUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `typeShop` JSON NOT NULL;

-- DropTable
DROP TABLE `cart`;

-- AddForeignKey
ALTER TABLE `Cart_Item` ADD CONSTRAINT `Cart_Item_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
