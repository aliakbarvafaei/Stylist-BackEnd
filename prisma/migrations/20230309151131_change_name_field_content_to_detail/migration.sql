/*
  Warnings:

  - You are about to drop the column `content` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `content`,
    ADD COLUMN `detail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `content`,
    ADD COLUMN `detail` VARCHAR(191) NULL;
