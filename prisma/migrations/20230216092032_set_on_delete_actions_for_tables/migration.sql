-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_item` DROP FOREIGN KEY `Cart_Item_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_item` DROP FOREIGN KEY `Cart_Item_productId_fkey`;

-- DropForeignKey
ALTER TABLE `category_clothing` DROP FOREIGN KEY `Category_Clothing_userId_fkey`;

-- DropForeignKey
ALTER TABLE `category_set` DROP FOREIGN KEY `Category_Set_userId_fkey`;

-- DropForeignKey
ALTER TABLE `clothing` DROP FOREIGN KEY `Clothing_category_clothingId_fkey`;

-- DropForeignKey
ALTER TABLE `clothing` DROP FOREIGN KEY `Clothing_userId_fkey`;

-- DropForeignKey
ALTER TABLE `counseling` DROP FOREIGN KEY `Counseling_userId_fkey`;

-- DropForeignKey
ALTER TABLE `counseling` DROP FOREIGN KEY `Counseling_user_stylistId_fkey`;

-- DropForeignKey
ALTER TABLE `image_clothing` DROP FOREIGN KEY `Image_Clothing_clothingId_fkey`;

-- DropForeignKey
ALTER TABLE `image_product` DROP FOREIGN KEY `Image_Product_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_productId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_counselingId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `product_category` DROP FOREIGN KEY `Product_Category_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product_category` DROP FOREIGN KEY `Product_Category_productId_fkey`;

-- DropForeignKey
ALTER TABLE `set` DROP FOREIGN KEY `Set_category_setId_fkey`;

-- DropForeignKey
ALTER TABLE `set` DROP FOREIGN KEY `Set_userId_fkey`;

-- DropForeignKey
ALTER TABLE `set_product` DROP FOREIGN KEY `Set_Product_productId_fkey`;

-- DropForeignKey
ALTER TABLE `set_product` DROP FOREIGN KEY `Set_Product_setId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_userId_fkey`;

-- AlterTable
ALTER TABLE `counseling` MODIFY `user_stylistId` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `addressId` INTEGER NULL;

-- AlterTable
ALTER TABLE `order_item` MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `counselingId` INTEGER NULL;

-- AlterTable
ALTER TABLE `set_product` MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaction` MODIFY `orderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clothing` ADD CONSTRAINT `Clothing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clothing` ADD CONSTRAINT `Clothing_category_clothingId_fkey` FOREIGN KEY (`category_clothingId`) REFERENCES `Category_Clothing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category_Clothing` ADD CONSTRAINT `Category_Clothing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image_Clothing` ADD CONSTRAINT `Image_Clothing_clothingId_fkey` FOREIGN KEY (`clothingId`) REFERENCES `Clothing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Set` ADD CONSTRAINT `Set_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Set` ADD CONSTRAINT `Set_category_setId_fkey` FOREIGN KEY (`category_setId`) REFERENCES `Category_Set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Set_Product` ADD CONSTRAINT `Set_Product_setId_fkey` FOREIGN KEY (`setId`) REFERENCES `Set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Set_Product` ADD CONSTRAINT `Set_Product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category_Set` ADD CONSTRAINT `Category_Set_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Counseling` ADD CONSTRAINT `Counseling_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Counseling` ADD CONSTRAINT `Counseling_user_stylistId_fkey` FOREIGN KEY (`user_stylistId`) REFERENCES `User_Stylist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_counselingId_fkey` FOREIGN KEY (`counselingId`) REFERENCES `Counseling`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_Item` ADD CONSTRAINT `Order_Item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_Item` ADD CONSTRAINT `Order_Item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart_Item` ADD CONSTRAINT `Cart_Item_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart_Item` ADD CONSTRAINT `Cart_Item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image_Product` ADD CONSTRAINT `Image_Product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Category` ADD CONSTRAINT `Product_Category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Category` ADD CONSTRAINT `Product_Category_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
