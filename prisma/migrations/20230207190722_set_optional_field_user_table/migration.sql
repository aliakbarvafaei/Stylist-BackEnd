-- AlterTable
ALTER TABLE `seller` MODIFY `shopName` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `gender` ENUM('MAN', 'WOMAN') NULL;

-- AlterTable
ALTER TABLE `user_stylist` MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
