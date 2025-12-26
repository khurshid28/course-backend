/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `hasCertificate` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `type` ENUM('COURSE_PURCHASE', 'BALANCE_TOPUP') NOT NULL DEFAULT 'COURSE_PURCHASE',
    MODIFY `courseId` INTEGER NULL,
    MODIFY `method` ENUM('CLICK', 'PAYME', 'UZUM', 'BALANCE') NOT NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `categories` VARCHAR(500) NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `totalRatings` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(500) NOT NULL,
    `courseId` INTEGER NULL,
    `link` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Banner_isActive_idx`(`isActive`),
    INDEX `Banner_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `icon` VARCHAR(100) NULL,
    `link` VARCHAR(500) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_isRead_idx`(`isRead`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromoCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `discountPercent` INTEGER NOT NULL,
    `type` ENUM('SINGLE_USE', 'USER_SINGLE_USE', 'UNLIMITED') NOT NULL DEFAULT 'USER_SINGLE_USE',
    `maxUsageCount` INTEGER NULL,
    `currentUsageCount` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PromoCode_code_key`(`code`),
    INDEX `PromoCode_code_idx`(`code`),
    INDEX `PromoCode_isActive_idx`(`isActive`),
    INDEX `PromoCode_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromoCodeUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `promoCodeId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `discount` DECIMAL(10, 2) NOT NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PromoCodeUsage_userId_idx`(`userId`),
    INDEX `PromoCodeUsage_promoCodeId_idx`(`promoCodeId`),
    INDEX `PromoCodeUsage_courseId_idx`(`courseId`),
    UNIQUE INDEX `PromoCodeUsage_userId_promoCodeId_key`(`userId`, `promoCodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Payment_courseId_idx` ON `Payment`(`courseId`);

-- CreateIndex
CREATE INDEX `Payment_type_idx` ON `Payment`(`type`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_userId_key` ON `Teacher`(`userId`);

-- CreateIndex
CREATE INDEX `Teacher_userId_idx` ON `Teacher`(`userId`);

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoCodeUsage` ADD CONSTRAINT `PromoCodeUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoCodeUsage` ADD CONSTRAINT `PromoCodeUsage_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `PromoCode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoCodeUsage` ADD CONSTRAINT `PromoCodeUsage_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
