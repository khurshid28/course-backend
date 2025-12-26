-- AlterTable
ALTER TABLE `notification` ADD COLUMN `image` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `discount` DECIMAL(10, 2) NULL,
    ADD COLUMN `originalAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `promoCodeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `promocode` ADD COLUMN `discountAmount` DECIMAL(10, 2) NULL,
    MODIFY `discountPercent` INTEGER NULL;

-- CreateTable
CREATE TABLE `TeacherRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TeacherRating_userId_idx`(`userId`),
    INDEX `TeacherRating_teacherId_idx`(`teacherId`),
    INDEX `TeacherRating_rating_idx`(`rating`),
    UNIQUE INDEX `TeacherRating_userId_teacherId_key`(`userId`, `teacherId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Payment_promoCodeId_idx` ON `Payment`(`promoCodeId`);

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `PromoCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherRating` ADD CONSTRAINT `TeacherRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherRating` ADD CONSTRAINT `TeacherRating_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
