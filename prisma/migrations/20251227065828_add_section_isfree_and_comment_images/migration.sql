-- AlterTable
ALTER TABLE `coursecomment` ADD COLUMN `images` TEXT NULL;

-- AlterTable
ALTER TABLE `section` ADD COLUMN `isFree` BOOLEAN NOT NULL DEFAULT false;
