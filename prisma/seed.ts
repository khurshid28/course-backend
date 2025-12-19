import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'IT & Programming',
        nameUz: 'IT va Dasturlash',
        icon: 'https://api.iconify.design/mdi:code-braces.svg',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Design',
        nameUz: 'Dizayn',
        icon: 'https://api.iconify.design/mdi:palette.svg',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Business',
        nameUz: 'Biznes',
        icon: 'https://api.iconify.design/mdi:briefcase.svg',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Languages',
        nameUz: 'Tillar',
        icon: 'https://api.iconify.design/mdi:translate.svg',
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
      },
    }),
    prisma.category.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Marketing',
        nameUz: 'Marketing',
        icon: 'https://api.iconify.design/mdi:chart-line.svg',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Create Teachers
  console.log('Creating teachers...');
  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Akmal Ergashev',
        bio: '5 yillik tajribaga ega Flutter dasturchi. 20+ mobil ilovalar yaratgan.',
        email: 'akmal@example.com',
        phone: '+998901234567',
        avatar: 'https://i.pravatar.cc/300?img=12',
        rating: 4.8,
        totalRatings: 156,
        categories: 'Flutter,Mobile Development,Dart',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Dilshod Karimov',
        bio: 'Backend dasturlash bo\'yicha mutaxassis. Node.js, Python, Go.',
        email: 'dilshod@example.com',
        phone: '+998901234568',
        avatar: 'https://i.pravatar.cc/300?img=33',
        rating: 4.9,
        totalRatings: 203,
        categories: 'Backend,Node.js,Python,API Development',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Nigora Saidova',
        bio: 'UI/UX dizayner. Adobe XD, Figma, Sketch.',
        email: 'nigora@example.com',
        phone: '+998901234569',
        avatar: 'https://i.pravatar.cc/300?img=47',
        rating: 4.7,
        totalRatings: 128,
        categories: 'UI/UX Design,Figma,Adobe XD,Web Design',
      },
    }),
  ]);
  console.log(`✅ Created ${teachers.length} teachers`);

  // Create Banners
  console.log('Creating banners...');
  const banners = await Promise.all([
    prisma.banner.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Flutter Development',
        description: 'Zero dan professional darajagacha',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        link: '/courses/1',
        order: 1,
        isActive: true,
      },
    }),
    prisma.banner.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Backend Development',
        description: 'NestJS bilan zamonaviy backend yarating',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        link: '/courses/2',
        order: 2,
        isActive: true,
      },
    }),
    prisma.banner.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'UI/UX Design',
        description: 'Professional dizayner bo\'ling',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        link: '/courses/4',
        order: 3,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${banners.length} banners`);

  // Create Courses
  console.log('Creating courses...');
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 1 },
      update: {},
      create: {
        teacherId: 1,
        categoryId: 1,
        title: 'Flutter Development',
        subtitle: 'Zero dan professional darajagacha',
        description: 'Bu kursda siz Flutter yordamida iOS va Android uchun mobil ilovalar yaratishni o\'rganasiz. Clean Architecture, BLoC, va ko\'plab amaliy loyihalar.',
        thumbnail: 'https://picsum.photos/seed/flutter/400/250',
        price: 250000,
        isFree: false,
        freeVideosCount: 3,
        duration: 1200,
        level: 'O\'rta',
        hasCertificate: true,
        rating: 4.8,
        totalStudents: 1250,
      },
    }),
    prisma.course.upsert({
      where: { id: 2 },
      update: {},
      create: {
        teacherId: 2,
        categoryId: 1,
        title: 'NestJS Backend Development',
        subtitle: 'Zamonaviy backend yaratish',
        description: 'NestJS framework yordamida professional backend API yaratishni o\'rganasiz. TypeScript, Prisma, PostgreSQL, JWT authentication.',
        thumbnail: 'https://picsum.photos/seed/nestjs/400/250',
        price: 300000,
        isFree: false,
        freeVideosCount: 2,
        duration: 900,
        level: 'Yuqori',
        hasCertificate: true,
        rating: 4.9,
        totalStudents: 850,
      },
    }),
    prisma.course.upsert({
      where: { id: 3 },
      update: {},
      create: {
        teacherId: 2,
        categoryId: 1,
        title: 'Python Foundation',
        subtitle: 'Dasturlashni o\'rganishni boshlang',
        description: 'Python tilida dasturlash asoslari. Variables, loops, functions, OOP va ko\'proq. Bepul kurs!',
        thumbnail: 'https://picsum.photos/seed/python/400/250',
        price: 0,
        isFree: true,
        freeVideosCount: 15,
        duration: 600,
        level: 'Boshlang\'ich',
        hasCertificate: false,
        rating: 4.7,
        totalStudents: 2100,
      },
    }),
    prisma.course.upsert({
      where: { id: 4 },
      update: {},
      create: {
        teacherId: 3,
        categoryId: 2,
        title: 'UI/UX Design Masterclass',
        subtitle: 'Figma va Adobe XD bilan dizayn',
        description: 'Zamonaviy mobil va web dizayn yaratishni o\'rganasiz. User research, wireframing, prototyping, va final design.',
        thumbnail: 'https://picsum.photos/seed/design/400/250',
        price: 200000,
        isFree: false,
        freeVideosCount: 4,
        duration: 750,
        level: 'O\'rta',
        hasCertificate: true,
        rating: 4.9,
        totalStudents: 1500,
      },
    }),
    prisma.course.upsert({
      where: { id: 5 },
      update: {},
      create: {
        teacherId: 1,
        categoryId: 1,
        title: 'React Native Complete Guide',
        subtitle: 'Cross-platform mobile development',
        description: 'React Native orqali iOS va Android uchun mobil ilovalar yarating. Expo, Navigation, Redux, va ko\'proq.',
        thumbnail: 'https://picsum.photos/seed/react/400/250',
        price: 280000,
        isFree: false,
        freeVideosCount: 2,
        duration: 1000,
        level: 'O\'rta',
        hasCertificate: true,
        rating: 4.6,
        totalStudents: 920,
      },
    }),
  ]);
  console.log(`✅ Created ${courses.length} courses`);

  // Create Sections and Videos for Course 1 (Flutter Development)
  console.log('Creating sections and videos for Flutter course...');
  const section1_1 = await prisma.section.create({
    data: {
      courseId: 1,
      title: 'Boshlang\'ich: Flutter asoslari',
      description: 'Flutter bilan tanishish va asosiy konseptlar',
      order: 1,
    },
  });

  await Promise.all([
    prisma.video.create({
      data: {
        courseId: 1,
        sectionId: section1_1.id,
        title: 'Kursga xush kelibsiz',
        description: 'Kursda nimalarni o\'rganishimiz va kurs haqida to\'liq ma\'lumot',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://picsum.photos/seed/flutter1/400/250',
        duration: 360,
        order: 1,
        isFree: true,
        screenshots: JSON.stringify([
          'https://picsum.photos/seed/s1/800/600',
          'https://picsum.photos/seed/s2/800/600',
        ]),
      },
    }),
    prisma.video.create({
      data: {
        courseId: 1,
        sectionId: section1_1.id,
        title: 'Flutter o\'rnatish',
        description: 'Flutter SDK ni kompyuterga o\'rnatish va sozlash',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://picsum.photos/seed/flutter2/400/250',
        duration: 420,
        order: 2,
        isFree: true,
        screenshots: JSON.stringify([
          'https://picsum.photos/seed/s3/800/600',
        ]),
      },
    }),
    prisma.video.create({
      data: {
        courseId: 1,
        sectionId: section1_1.id,
        title: 'Birinchi Flutter ilovasi',
        description: 'Hello World ilovasi yaratish va ishga tushirish',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://picsum.photos/seed/flutter3/400/250',
        duration: 540,
        order: 3,
        isFree: false,
      },
    }),
  ]);

  const section1_2 = await prisma.section.create({
    data: {
      courseId: 1,
      title: 'Widgetlar va Layout',
      description: 'Flutter widgetlari bilan ishlash',
      order: 2,
    },
  });

  await Promise.all([
    prisma.video.create({
      data: {
        courseId: 1,
        sectionId: section1_2.id,
        title: 'Stateless va Stateful Widgetlar',
        description: 'Widget turlari va ularning farqlari',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://picsum.photos/seed/flutter4/400/250',
        duration: 720,
        order: 1,
        isFree: false,
        screenshots: JSON.stringify([
          'https://picsum.photos/seed/s4/800/600',
          'https://picsum.photos/seed/s5/800/600',
          'https://picsum.photos/seed/s6/800/600',
        ]),
      },
    }),
    prisma.video.create({
      data: {
        courseId: 1,
        sectionId: section1_2.id,
        title: 'Layout Widgetlari',
        description: 'Row, Column, Stack va boshqa layout widgetlar',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: 'https://picsum.photos/seed/flutter5/400/250',
        duration: 680,
        order: 2,
        isFree: false,
      },
    }),
  ]);
  console.log('✅ Created sections and videos for Flutter course');

  // Create Test for Course 1
  console.log('Creating test for Flutter course...');
  const test1 = await prisma.test.create({
    data: {
      courseId: 1,
      title: 'Flutter Asoslari Final Test',
      description: 'Kurs davomida o\'rgangan bilimlaringizni tekshiring',
      duration: 30,
      passingScore: 70,
    },
  });

  await Promise.all([
    prisma.testQuestion.create({
      data: {
        testId: test1.id,
        question: 'Flutter nima?',
        options: JSON.stringify([
          'Google tomonidan yaratilgan UI framework',
          'Backend framework',
          'Database',
          'Programming language',
        ]),
        correctAnswer: 0,
        order: 1,
      },
    }),
    prisma.testQuestion.create({
      data: {
        testId: test1.id,
        question: 'Stateless Widget nima uchun ishlatiladi?',
        options: JSON.stringify([
          'State o\'zgarmayotgan UI uchun',
          'State o\'zgaradigan UI uchun',
          'Database uchun',
          'API uchun',
        ]),
        correctAnswer: 0,
        order: 2,
      },
    }),
    prisma.testQuestion.create({
      data: {
        testId: test1.id,
        question: 'Hot Reload nima qiladi?',
        options: JSON.stringify([
          'Ilovani to\'liq qayta yuklaydi',
          'Faqat o\'zgargan qismlarni yangilaydi',
          'Ma\'lumotlarni o\'chiradi',
          'State ni reset qiladi',
        ]),
        correctAnswer: 1,
        order: 3,
      },
    }),
  ]);
  console.log('✅ Created test for Flutter course');

  // Create FAQs for Course 1
  console.log('Creating FAQs...');
  await Promise.all([
    prisma.courseFAQ.create({
      data: {
        courseId: 1,
        question: 'Bu kursdan nma foyda?',
        answer: 'Siz Flutter yordamida professional mobil ilovalar yaratishni o\'rganasiz. iOS va Android uchun bitta kod bilan ilova yaratish, Clean Architecture, State Management va ko\'plab amaliy loyihalar.',
        order: 1,
      },
    }),
    prisma.courseFAQ.create({
      data: {
        courseId: 1,
        question: 'Flutter developer bo\'lish uchun qancha vaqt kerak?',
        answer: 'Agar har kuni 2-3 soat mashq qilsangiz, 3-6 oy ichida junior Flutter developer bo\'lishingiz mumkin. Bu kurs sizga kerakli barcha bilimlarni beradi.',
        order: 2,
      },
    }),
    prisma.courseFAQ.create({
      data: {
        courseId: 1,
        question: 'Kursda qanday loyihalar yasaymiz?',
        answer: 'To\'rt katta loyiha: E-commerce ilova, Chat messenger, Weather app, va Portfolio website. Har bir loyiha real dunyo ilovalarining namunasi.',
        order: 3,
      },
    }),
  ]);
  console.log('✅ Created FAQs');

  // Create Videos for other courses (shorter version)
  console.log('Creating videos for other courses...');
  for (const course of courses.slice(1)) {
    const section = await prisma.section.create({
      data: {
        courseId: course.id,
        title: 'Boshlang\'ich qism',
        order: 1,
      },
    });

    await Promise.all([
      prisma.video.create({
        data: {
          courseId: course.id,
          sectionId: section.id,
          title: 'Kirish',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: course.thumbnail,
          duration: 300,
          order: 1,
          isFree: true,
        },
      }),
      prisma.video.create({
        data: {
          courseId: course.id,
          sectionId: section.id,
          title: 'Asosiy tushunchalar',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail: course.thumbnail,
          duration: 450,
          order: 2,
          isFree: false,
        },
      }),
    ]);
  }
  console.log('✅ Created videos for all courses');

  // Create Test User
  console.log('Creating test user...');
  const testUser = await prisma.user.upsert({
    where: { phone: '+998901234560' },
    update: {},
    create: {
      phone: '+998901234560',
      firstName: 'Test',
      surname: 'User',
      email: 'test@example.com',
      avatar: 'https://i.pravatar.cc/300?img=68',
      gender: 'MALE',
      region: 'TOSHKENT_SHAHAR',
      isVerified: true,
    },
  });
  console.log('✅ Created test user');

  // Create some enrollments for test user
  console.log('Creating test enrollments...');
  await Promise.all([
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: testUser.id,
          courseId: 1,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        courseId: 1,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: testUser.id,
          courseId: 3,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        courseId: 3,
      },
    }),
  ]);
  console.log('✅ Created test enrollments');

  // Create test feedbacks
  console.log('Creating test feedbacks...');
  await Promise.all([
    prisma.feedback.upsert({
      where: {
        userId_courseId: {
          userId: testUser.id,
          courseId: 1,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        courseId: 1,
        rating: 5,
        comment: 'Juda zo\'r kurs! Hammaga tavsiya qilaman.',
      },
    }),
  ]);
  console.log('✅ Created test feedbacks');

  // Create Comments for Course 1
  console.log('Creating course comments...');
  await Promise.all([
    prisma.courseComment.create({
      data: {
        userId: testUser.id,
        courseId: 1,
        comment: 'Juda zo\'r kurs! Barcha narsani tushuntirib berishdi. Rahmat!',
        rating: 5,
        screenshots: JSON.stringify([
          'https://picsum.photos/seed/c1/800/600',
        ]),
      },
    }),
    prisma.courseComment.create({
      data: {
        userId: testUser.id,
        courseId: 1,
        comment: 'Videolar juda sifatli. Amaliy loyihalar katta yordam berdi.',
        rating: 5,
      },
    }),
  ]);
  console.log('✅ Created course comments');

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
