-- CreateTable
CREATE TABLE `videocomment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `videoId` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `images` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `videocomment_userId_idx`(`userId`),
    INDEX `videocomment_videoId_idx`(`videoId`),
    INDEX `videocomment_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `videocomment` ADD CONSTRAINT `videocomment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videocomment` ADD CONSTRAINT `videocomment_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
