/*
  Warnings:

  - Added the required column `correctAnswers` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuestions` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate` ADD COLUMN `pdfUrl` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `test` ADD COLUMN `availabilityType` ENUM('ANYTIME', 'DAILY', 'EVERY_3_DAYS', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'ANYTIME',
    ADD COLUMN `availableAfterDays` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `maxDuration` INTEGER NOT NULL DEFAULT 60,
    ADD COLUMN `minCorrectAnswers` INTEGER NOT NULL DEFAULT 18;

-- AlterTable
ALTER TABLE `testresult` ADD COLUMN `correctAnswers` INTEGER NOT NULL,
    ADD COLUMN `totalQuestions` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TestSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `testId` INTEGER NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `submittedAt` DATETIME(3) NULL,
    `isExpired` BOOLEAN NOT NULL DEFAULT false,
    `isSubmitted` BOOLEAN NOT NULL DEFAULT false,
    `currentAnswers` TEXT NOT NULL,

    INDEX `TestSession_userId_idx`(`userId`),
    INDEX `TestSession_testId_idx`(`testId`),
    INDEX `TestSession_isExpired_idx`(`isExpired`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestSessionAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `selectedAnswer` INTEGER NOT NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TestSessionAnswer_sessionId_idx`(`sessionId`),
    INDEX `TestSessionAnswer_questionId_idx`(`questionId`),
    UNIQUE INDEX `TestSessionAnswer_sessionId_questionId_key`(`sessionId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TestSession` ADD CONSTRAINT `TestSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestSession` ADD CONSTRAINT `TestSession_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestSessionAnswer` ADD CONSTRAINT `TestSessionAnswer_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TestSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestSessionAnswer` ADD CONSTRAINT `TestSessionAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `TestQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
