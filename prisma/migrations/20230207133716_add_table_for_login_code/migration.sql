/*
  Warnings:

  - You are about to drop the column `email` on the `passreset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user]` on the table `PassReset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user` to the `PassReset` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `seller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `user_stylist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user_stylist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user_stylist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `PassReset_email_key` ON `passreset`;

-- AlterTable
ALTER TABLE `passreset` DROP COLUMN `email`,
    ADD COLUMN `user` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `seller` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_stylist` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `LoginCode` (
    `phone` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,

    UNIQUE INDEX `LoginCode_phone_key`(`phone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `PassReset_user_key` ON `PassReset`(`user`);
