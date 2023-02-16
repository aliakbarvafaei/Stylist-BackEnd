/*
  Warnings:

  - You are about to drop the column `address` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(4))`.
  - You are about to drop the column `content` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Cart_phone_key` ON `cart`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `address`,
    DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `cart_item` DROP COLUMN `discount`,
    DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `address`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `deliveryTime` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `content`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
