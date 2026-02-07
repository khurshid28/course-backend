import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting test data seeding...');

  // 1. Find or create test user
  let testUser = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'test@example.com' },
        { phone: '+998901234567' }
      ]
    },
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        phone: '+998901234567',
        firstName: 'Test',
        surname: 'User',
      },
    });
    console.log('✓ Test user created:', testUser.email);
  } else {
    console.log('✓ Test user found:', testUser.email);
  }

  // 2. Get first course for testing
  const firstCourse = await prisma.course.findFirst({
    where: { isActive: true },
    include: { tests: true },
  });

  if (!firstCourse) {
    console.log('⚠ No active courses found. Please create a course first.');
    return;
  }

  console.log(`✓ Using course: ${firstCourse.title}`);

  // 3. Create tests if they don't exist
  const existingTests = await prisma.test.findMany({
    where: { courseId: firstCourse.id },
  });

  if (existingTests.length === 0) {
    // Create 3 tests for the course
    for (let i = 1; i <= 3; i++) {
      const test = await prisma.test.create({
        data: {
          courseId: firstCourse.id,
          title: `Test ${i}: ${firstCourse.title}`,
          description: `Bu ${firstCourse.title} kursi uchun ${i}-test`,
          duration: 30,
          maxDuration: 60,
          passingScore: 70,
          minCorrectAnswers: 18,
          availabilityType: 'ANYTIME',
          isActive: true,
        },
      });

      // Create questions for the test
      const questions = [
        {
          question: `${i}-test, 1-savol: Bu savolning to'g'ri javobi?`,
          options: JSON.stringify([
            'Birinchi variant',
            'Ikkinchi variant',
            'Uchinchi variant',
            'To\'rtinchi variant'
          ]),
          correctAnswer: 0,
          order: 1,
        },
        {
          question: `${i}-test, 2-savol: Qaysi javob to'g'ri?`,
          options: JSON.stringify([
            'Variant A',
            'Variant B',
            'Variant C',
            'Variant D'
          ]),
          correctAnswer: 1,
          order: 2,
        },
        {
          question: `${i}-test, 3-savol: Quyidagilardan qaysi biri to'g'ri?`,
          options: JSON.stringify([
            'To\'g\'ri variant 1',
            'Noto\'g\'ri variant',
            'To\'g\'ri variant 2',
            'Yana noto\'g\'ri'
          ]),
          correctAnswer: 0,
          order: 3,
        },
      ];

      for (const q of questions) {
        await prisma.testQuestion.create({
          data: {
            testId: test.id,
            ...q,
          },
        });
      }

      console.log(`✓ Test ${i} created with 3 questions for course: ${firstCourse.title}`);
    }
  } else {
    console.log(`✓ ${existingTests.length} tests already exist for this course`);
  }

  // 4. Create enrollments
  let enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: testUser.id,
      courseId: firstCourse.id,
    },
  });

  if (!enrollment) {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year subscription

    enrollment = await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        courseId: firstCourse.id,
        subscriptionDuration: 'ONE_YEAR',
        enrolledAt: now,
        expiresAt: expiresAt,
        isActive: true,
      },
    });
    console.log('✓ Enrollment created');
  } else {
    console.log('✓ Enrollment already exists');
  }

  // 5. Create test results and certificates
  const tests = await prisma.test.findMany({
    where: { courseId: firstCourse.id },
  });

  for (const test of tests) {
    // Check if user already has a result for this test
    const existingResult = await prisma.testResult.findFirst({
      where: {
        userId: testUser.id,
        testId: test.id,
      },
    });

    if (!existingResult) {
      // Create a passing test result
      const testResult = await prisma.testResult.create({
        data: {
          userId: testUser.id,
          testId: test.id,
          score: 85,
          totalQuestions: 3,
          correctAnswers: 2,
          answers: JSON.stringify([0, 1, 0]), // Example answers
          isPassed: true,
          completedAt: new Date(),
        },
      });

      // Create certificate for this test result
      const certificateNo = `CERT-${testUser.id}-${test.id}-${Date.now()}`;
      await prisma.certificate.create({
        data: {
          userId: testUser.id,
          courseId: firstCourse.id,
          testResultId: testResult.id,
          certificateNo: certificateNo,
          issuedAt: new Date(),
        },
      });

      console.log(`✓ Test result and certificate created for: ${test.title}`);
    }
  }

  // 6. Create more enrollments for other courses
  const allCourses = await prisma.course.findMany({
    where: { isActive: true },
    take: 5,
    include: { tests: true },
  });

  for (const course of allCourses) {
    if (course.id === firstCourse.id) continue;

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: testUser.id,
        courseId: course.id,
      },
    });

    if (!existingEnrollment) {
      const now = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const enrolledAt = new Date(now);
      enrolledAt.setDate(enrolledAt.getDate() - randomDaysAgo);
      
      const expiresAt = new Date(enrolledAt);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await prisma.enrollment.create({
        data: {
          userId: testUser.id,
          courseId: course.id,
          subscriptionDuration: 'ONE_YEAR',
          enrolledAt: enrolledAt,
          expiresAt: expiresAt,
          isActive: true,
        },
      });

      // Create test results and certificates if course has tests
      if (course.tests && course.tests.length > 0) {
        const firstTest = course.tests[0];
        const testResult = await prisma.testResult.create({
          data: {
            userId: testUser.id,
            testId: firstTest.id,
            score: 80 + Math.floor(Math.random() * 15),
            totalQuestions: 3,
            correctAnswers: 2 + Math.floor(Math.random() * 2),
            answers: JSON.stringify([0, 1, 0]),
            isPassed: true,
            completedAt: new Date(),
          },
        });

        const certificateNo = `CERT-${testUser.id}-${firstTest.id}-${Date.now()}`;
        await prisma.certificate.create({
          data: {
            userId: testUser.id,
            courseId: course.id,
            testResultId: testResult.id,
            certificateNo: certificateNo,
            issuedAt: new Date(),
          },
        });

        console.log(`✓ Enrollment and certificate created for: ${course.title}`);
      }
    }
  }

  // 7. Summary
  const totalTests = await prisma.test.count();
  const totalCertificates = await prisma.certificate.count();
  const totalEnrollments = await prisma.enrollment.count({ where: { userId: testUser.id } });

  console.log('\n=== Summary ===');
  console.log(`Total Tests in system: ${totalTests}`);
  console.log(`Total Certificates issued: ${totalCertificates}`);
  console.log(`Test user enrollments: ${totalEnrollments}`);
  console.log(`Test user: ${testUser.email} (${testUser.phone})`);
  console.log('\n✓ Test data seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding test data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
