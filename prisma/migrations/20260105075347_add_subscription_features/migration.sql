-- AlterTable
ALTER TABLE `enrollment` ADD COLUMN `subscriptionDuration` ENUM('ONE_MONTH', 'SIX_MONTHS', 'ONE_YEAR') NOT NULL DEFAULT 'ONE_YEAR';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `subscriptionDuration` ENUM('ONE_MONTH', 'SIX_MONTHS', 'ONE_YEAR') NULL;

-- CreateIndex
CREATE INDEX `Enrollment_expiresAt_idx` ON `Enrollment`(`expiresAt`);

-- CreateIndex
CREATE INDEX `Enrollment_isActive_idx` ON `Enrollment`(`isActive`);
