/*
  Warnings:

  - You are about to drop the column `address` on the `seller` table. All the data in the column will be lost.
  - Added the required column `city` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Seller_email_key` ON `seller`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `seller` DROP COLUMN `address`;

-- CreateTable
CREATE TABLE `Address_Seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `sellerId` INTEGER NOT NULL,

    UNIQUE INDEX `Address_Seller_sellerId_key`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address_Seller` ADD CONSTRAINT `Address_Seller_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
