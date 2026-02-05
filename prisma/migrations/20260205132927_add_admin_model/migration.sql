-- DropForeignKey
ALTER TABLE `banner` DROP FOREIGN KEY `Banner_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_testResultId_fkey`;

-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_userId_fkey`;

-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `Course_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `Course_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `coursecomment` DROP FOREIGN KEY `CourseComment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `coursecomment` DROP FOREIGN KEY `CourseComment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `coursefaq` DROP FOREIGN KEY `CourseFAQ_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `courserating` DROP FOREIGN KEY `CourseRating_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `courserating` DROP FOREIGN KEY `CourseRating_userId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `Enrollment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `Enrollment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_userId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_promoCodeId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `promocodeusage` DROP FOREIGN KEY `PromoCodeUsage_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `promocodeusage` DROP FOREIGN KEY `PromoCodeUsage_promoCodeId_fkey`;

-- DropForeignKey
ALTER TABLE `promocodeusage` DROP FOREIGN KEY `PromoCodeUsage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `savedcourse` DROP FOREIGN KEY `SavedCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `savedcourse` DROP FOREIGN KEY `SavedCourse_userId_fkey`;

-- DropForeignKey
ALTER TABLE `section` DROP FOREIGN KEY `Section_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teacherrating` DROP FOREIGN KEY `TeacherRating_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `teacherrating` DROP FOREIGN KEY `TeacherRating_userId_fkey`;

-- DropForeignKey
ALTER TABLE `test` DROP FOREIGN KEY `Test_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `testquestion` DROP FOREIGN KEY `TestQuestion_testId_fkey`;

-- DropForeignKey
ALTER TABLE `testresult` DROP FOREIGN KEY `TestResult_testId_fkey`;

-- DropForeignKey
ALTER TABLE `testresult` DROP FOREIGN KEY `TestResult_userId_fkey`;

-- DropForeignKey
ALTER TABLE `testsession` DROP FOREIGN KEY `TestSession_testId_fkey`;

-- DropForeignKey
ALTER TABLE `testsession` DROP FOREIGN KEY `TestSession_userId_fkey`;

-- DropForeignKey
ALTER TABLE `testsessionanswer` DROP FOREIGN KEY `TestSessionAnswer_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `testsessionanswer` DROP FOREIGN KEY `TestSessionAnswer_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `verificationcode` DROP FOREIGN KEY `VerificationCode_userId_fkey`;

-- DropForeignKey
ALTER TABLE `video` DROP FOREIGN KEY `Video_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `video` DROP FOREIGN KEY `Video_sectionId_fkey`;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(13) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(200) NULL,
    `avatar` VARCHAR(500) NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR') NOT NULL DEFAULT 'ADMIN',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_login_key`(`login`),
    UNIQUE INDEX `Admin_phone_key`(`phone`),
    INDEX `Admin_login_idx`(`login`),
    INDEX `Admin_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `verificationcode` ADD CONSTRAINT `verificationcode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `section` ADD CONSTRAINT `section_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video` ADD CONSTRAINT `video_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video` ADD CONSTRAINT `video_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test` ADD CONSTRAINT `test_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testquestion` ADD CONSTRAINT `testquestion_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testsession` ADD CONSTRAINT `testsession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testsession` ADD CONSTRAINT `testsession_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testsessionanswer` ADD CONSTRAINT `testsessionanswer_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `testsession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testsessionanswer` ADD CONSTRAINT `testsessionanswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `testquestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testresult` ADD CONSTRAINT `testresult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testresult` ADD CONSTRAINT `testresult_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificate` ADD CONSTRAINT `certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificate` ADD CONSTRAINT `certificate_testResultId_fkey` FOREIGN KEY (`testResultId`) REFERENCES `testresult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursefaq` ADD CONSTRAINT `coursefaq_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursecomment` ADD CONSTRAINT `coursecomment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursecomment` ADD CONSTRAINT `coursecomment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `savedcourse` ADD CONSTRAINT `savedcourse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `savedcourse` ADD CONSTRAINT `savedcourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `banner` ADD CONSTRAINT `banner_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promocodeusage` ADD CONSTRAINT `promocodeusage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promocodeusage` ADD CONSTRAINT `promocodeusage_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `promocode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promocodeusage` ADD CONSTRAINT `promocodeusage_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `promocode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacherrating` ADD CONSTRAINT `teacherrating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacherrating` ADD CONSTRAINT `teacherrating_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courserating` ADD CONSTRAINT `courserating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courserating` ADD CONSTRAINT `courserating_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `banner` RENAME INDEX `Banner_courseId_idx` TO `banner_courseId_idx`;

-- RenameIndex
ALTER TABLE `banner` RENAME INDEX `Banner_isActive_idx` TO `banner_isActive_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_name_idx` TO `category_name_idx`;

-- RenameIndex
ALTER TABLE `certificate` RENAME INDEX `Certificate_certificateNo_idx` TO `certificate_certificateNo_idx`;

-- RenameIndex
ALTER TABLE `certificate` RENAME INDEX `Certificate_certificateNo_key` TO `certificate_certificateNo_key`;

-- RenameIndex
ALTER TABLE `certificate` RENAME INDEX `Certificate_testResultId_key` TO `certificate_testResultId_key`;

-- RenameIndex
ALTER TABLE `certificate` RENAME INDEX `Certificate_userId_idx` TO `certificate_userId_idx`;

-- RenameIndex
ALTER TABLE `course` RENAME INDEX `Course_categoryId_idx` TO `course_categoryId_idx`;

-- RenameIndex
ALTER TABLE `course` RENAME INDEX `Course_teacherId_idx` TO `course_teacherId_idx`;

-- RenameIndex
ALTER TABLE `course` RENAME INDEX `Course_title_idx` TO `course_title_idx`;

-- RenameIndex
ALTER TABLE `coursecomment` RENAME INDEX `CourseComment_courseId_idx` TO `coursecomment_courseId_idx`;

-- RenameIndex
ALTER TABLE `coursecomment` RENAME INDEX `CourseComment_createdAt_idx` TO `coursecomment_createdAt_idx`;

-- RenameIndex
ALTER TABLE `coursecomment` RENAME INDEX `CourseComment_userId_idx` TO `coursecomment_userId_idx`;

-- RenameIndex
ALTER TABLE `coursefaq` RENAME INDEX `CourseFAQ_courseId_idx` TO `coursefaq_courseId_idx`;

-- RenameIndex
ALTER TABLE `courserating` RENAME INDEX `CourseRating_courseId_idx` TO `courserating_courseId_idx`;

-- RenameIndex
ALTER TABLE `courserating` RENAME INDEX `CourseRating_rating_idx` TO `courserating_rating_idx`;

-- RenameIndex
ALTER TABLE `courserating` RENAME INDEX `CourseRating_userId_courseId_key` TO `courserating_userId_courseId_key`;

-- RenameIndex
ALTER TABLE `courserating` RENAME INDEX `CourseRating_userId_idx` TO `courserating_userId_idx`;

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_courseId_idx` TO `enrollment_courseId_idx`;

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_expiresAt_idx` TO `enrollment_expiresAt_idx`;

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_isActive_idx` TO `enrollment_isActive_idx`;

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_userId_courseId_key` TO `enrollment_userId_courseId_key`;

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_userId_idx` TO `enrollment_userId_idx`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `Feedback_courseId_idx` TO `feedback_courseId_idx`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `Feedback_rating_idx` TO `feedback_rating_idx`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `Feedback_userId_courseId_key` TO `feedback_userId_courseId_key`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `Feedback_userId_idx` TO `feedback_userId_idx`;

-- RenameIndex
ALTER TABLE `notification` RENAME INDEX `Notification_createdAt_idx` TO `notification_createdAt_idx`;

-- RenameIndex
ALTER TABLE `notification` RENAME INDEX `Notification_isRead_idx` TO `notification_isRead_idx`;

-- RenameIndex
ALTER TABLE `notification` RENAME INDEX `Notification_userId_idx` TO `notification_userId_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_courseId_idx` TO `payment_courseId_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_promoCodeId_idx` TO `payment_promoCodeId_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_status_idx` TO `payment_status_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_transactionId_idx` TO `payment_transactionId_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_transactionId_key` TO `payment_transactionId_key`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_type_idx` TO `payment_type_idx`;

-- RenameIndex
ALTER TABLE `payment` RENAME INDEX `Payment_userId_idx` TO `payment_userId_idx`;

-- RenameIndex
ALTER TABLE `promocode` RENAME INDEX `PromoCode_code_idx` TO `promocode_code_idx`;

-- RenameIndex
ALTER TABLE `promocode` RENAME INDEX `PromoCode_code_key` TO `promocode_code_key`;

-- RenameIndex
ALTER TABLE `promocode` RENAME INDEX `PromoCode_expiresAt_idx` TO `promocode_expiresAt_idx`;

-- RenameIndex
ALTER TABLE `promocode` RENAME INDEX `PromoCode_isActive_idx` TO `promocode_isActive_idx`;

-- RenameIndex
ALTER TABLE `promocodeusage` RENAME INDEX `PromoCodeUsage_courseId_idx` TO `promocodeusage_courseId_idx`;

-- RenameIndex
ALTER TABLE `promocodeusage` RENAME INDEX `PromoCodeUsage_promoCodeId_idx` TO `promocodeusage_promoCodeId_idx`;

-- RenameIndex
ALTER TABLE `promocodeusage` RENAME INDEX `PromoCodeUsage_userId_idx` TO `promocodeusage_userId_idx`;

-- RenameIndex
ALTER TABLE `promocodeusage` RENAME INDEX `PromoCodeUsage_userId_promoCodeId_key` TO `promocodeusage_userId_promoCodeId_key`;

-- RenameIndex
ALTER TABLE `savedcourse` RENAME INDEX `SavedCourse_courseId_idx` TO `savedcourse_courseId_idx`;

-- RenameIndex
ALTER TABLE `savedcourse` RENAME INDEX `SavedCourse_userId_courseId_key` TO `savedcourse_userId_courseId_key`;

-- RenameIndex
ALTER TABLE `savedcourse` RENAME INDEX `SavedCourse_userId_idx` TO `savedcourse_userId_idx`;

-- RenameIndex
ALTER TABLE `section` RENAME INDEX `Section_courseId_idx` TO `section_courseId_idx`;

-- RenameIndex
ALTER TABLE `section` RENAME INDEX `Section_order_idx` TO `section_order_idx`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_email_idx` TO `teacher_email_idx`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_email_key` TO `teacher_email_key`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_userId_idx` TO `teacher_userId_idx`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_userId_key` TO `teacher_userId_key`;

-- RenameIndex
ALTER TABLE `teacherrating` RENAME INDEX `TeacherRating_rating_idx` TO `teacherrating_rating_idx`;

-- RenameIndex
ALTER TABLE `teacherrating` RENAME INDEX `TeacherRating_teacherId_idx` TO `teacherrating_teacherId_idx`;

-- RenameIndex
ALTER TABLE `teacherrating` RENAME INDEX `TeacherRating_userId_idx` TO `teacherrating_userId_idx`;

-- RenameIndex
ALTER TABLE `teacherrating` RENAME INDEX `TeacherRating_userId_teacherId_key` TO `teacherrating_userId_teacherId_key`;

-- RenameIndex
ALTER TABLE `test` RENAME INDEX `Test_courseId_idx` TO `test_courseId_idx`;

-- RenameIndex
ALTER TABLE `testquestion` RENAME INDEX `TestQuestion_testId_idx` TO `testquestion_testId_idx`;

-- RenameIndex
ALTER TABLE `testresult` RENAME INDEX `TestResult_testId_idx` TO `testresult_testId_idx`;

-- RenameIndex
ALTER TABLE `testresult` RENAME INDEX `TestResult_userId_idx` TO `testresult_userId_idx`;

-- RenameIndex
ALTER TABLE `testsession` RENAME INDEX `TestSession_isExpired_idx` TO `testsession_isExpired_idx`;

-- RenameIndex
ALTER TABLE `testsession` RENAME INDEX `TestSession_testId_idx` TO `testsession_testId_idx`;

-- RenameIndex
ALTER TABLE `testsession` RENAME INDEX `TestSession_userId_idx` TO `testsession_userId_idx`;

-- RenameIndex
ALTER TABLE `testsessionanswer` RENAME INDEX `TestSessionAnswer_questionId_idx` TO `testsessionanswer_questionId_idx`;

-- RenameIndex
ALTER TABLE `testsessionanswer` RENAME INDEX `TestSessionAnswer_sessionId_idx` TO `testsessionanswer_sessionId_idx`;

-- RenameIndex
ALTER TABLE `testsessionanswer` RENAME INDEX `TestSessionAnswer_sessionId_questionId_key` TO `testsessionanswer_sessionId_questionId_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_idx` TO `user_email_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_phone_idx` TO `user_phone_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_phone_key` TO `user_phone_key`;

-- RenameIndex
ALTER TABLE `verificationcode` RENAME INDEX `VerificationCode_code_idx` TO `verificationcode_code_idx`;

-- RenameIndex
ALTER TABLE `verificationcode` RENAME INDEX `VerificationCode_userId_idx` TO `verificationcode_userId_idx`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_courseId_idx` TO `video_courseId_idx`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_order_idx` TO `video_order_idx`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_sectionId_idx` TO `video_sectionId_idx`;
