/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - Made the column `password` on table `seller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user_stylist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `seller` MODIFY `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`;

-- AlterTable
ALTER TABLE `user_stylist` MODIFY `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
