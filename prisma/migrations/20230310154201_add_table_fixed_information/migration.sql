/*
  Warnings:

  - The primary key for the `address_seller` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `address_seller` table. All the data in the column will be lost.
  - The primary key for the `wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `address_seller` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`sellerId`);

-- AlterTable
ALTER TABLE `wallet` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`sellerId`);

-- CreateTable
CREATE TABLE `Fixed_Information` (
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Fixed_Information_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fixed_Information` ADD CONSTRAINT `Fixed_Information_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
