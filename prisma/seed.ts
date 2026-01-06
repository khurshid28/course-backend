import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to copy video file to uploads directory
function copyVideoToUploads(sourcePath: string, filename: string): string {
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'videos');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const destPath = path.join(uploadsDir, filename);
  
  // Check if source file exists
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied video: ${filename}`);
    return `/uploads/videos/${filename}`;
  } else {
    console.log(`⚠️  Source video not found: ${sourcePath}`);
    // Return a placeholder URL
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
}

// Helper function to get file size
function getFileSize(filePath: string): bigint {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return BigInt(stats.size);
    }
  } catch (e) {
    console.error('Error getting file size:', e);
  }
  // Default size for placeholder videos (estimate 1MB)
  return BigInt(1048576);
}

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
        bio: '5 yillik tajribaga ega Flutter dasturchi. Google Developer Expert. 20+ mobil ilovalar yaratgan va 50+ startup loyihalarda ishtirok etgan. MIT dan kompyuter fanlari bo\'yicha magistr darajasi.',
        email: 'akmal@example.com',
        phone: '+998901234567',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 2847,
        categories: 'Flutter,Mobile Development,Dart,Firebase',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Dilshod Karimov',
        bio: 'Senior Backend Engineer @ Yandex. 8+ yillik tajriba. Mikroservislar, API Development, va Cloud Architecture bo\'yicha mutaxassis. 100+ mijozlarga backend yechimlar yaratgan.',
        email: 'dilshod@example.com',
        phone: '+998901234568',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 3521,
        categories: 'Backend,Node.js,Python,API Development,AWS',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Nigora Saidova',
        bio: 'Lead UI/UX Designer @ EPAM. Adobe Certified Professional. 6+ yillik tajriba. 200+ loyihalarni dizayn qilgan. Awwwards va CSS Design Awards sovrindori.',
        email: 'nigora@example.com',
        phone: '+998901234569',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        rating: 4.8,
        totalRatings: 1986,
        categories: 'UI/UX Design,Figma,Adobe XD,Web Design',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Sardor Rahimov',
        bio: 'Full Stack Developer va Startup Mentor. Y Combinator dasturida qatnashgan. React, Next.js, va zamonaviy web texnologiyalar bo\'yicha ekspert. 10+ muvaffaqiyatli startup yaratgan.',
        email: 'sardor@example.com',
        phone: '+998901234570',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 4123,
        categories: 'React,Next.js,Full Stack,JavaScript,TypeScript',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Malika Tursunova',
        bio: 'Data Science va Machine Learning Specialist @ Google AI. Stanford dan PhD darajasi. Kaggle Grandmaster. 30+ research papers nashr etgan.',
        email: 'malika@example.com',
        phone: '+998901234571',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        rating: 5.0,
        totalRatings: 1567,
        categories: 'Data Science,Machine Learning,Python,AI,Deep Learning',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Javohir Ismoilov',
        bio: 'DevOps Engineer @ Microsoft Azure. Kubernetes Certified Administrator. CI/CD pipelines va cloud infrastructure bo\'yicha 7+ yillik tajriba. 500+ server infratuzilmasini boshqargan.',
        email: 'javohir@example.com',
        phone: '+998901234572',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
        rating: 4.8,
        totalRatings: 2234,
        categories: 'DevOps,Docker,Kubernetes,AWS,Azure,CI/CD',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: 'Dildora Ahmadova',
        bio: 'Digital Marketing Strategist. Google va Meta Certified Trainer. 50+ brendlar bilan ishlagan. E-commerce va social media marketing bo\'yicha 9+ yillik tajriba.',
        email: 'dildora@example.com',
        phone: '+998901234573',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        rating: 4.7,
        totalRatings: 3456,
        categories: 'Digital Marketing,SMM,SEO,Google Ads,Content Marketing',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 8 },
      update: {},
      create: {
        name: 'Bobur Yuldashev',
        bio: 'iOS Developer @ Apple. Swift va SwiftUI bo\'yicha ekspert. 15+ AppStore Featured ilovalar yaratgan. WWDC Speaker va iOS community leader.',
        email: 'bobur@example.com',
        phone: '+998901234574',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 1876,
        categories: 'iOS,Swift,SwiftUI,Mobile Development,Xcode',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 9 },
      update: {},
      create: {
        name: 'Zilola Nazarova',
        bio: 'Motion Designer va Video Editor. Adobe After Effects va Premiere Pro Certified. 1000+ kommersial videolar yaratgan. Netflix va Disney+ uchun ishlagan.',
        email: 'zilola@example.com',
        phone: '+998901234575',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        rating: 4.8,
        totalRatings: 2145,
        categories: 'Motion Design,Video Editing,After Effects,Premiere Pro,Animation',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 10 },
      update: {},
      create: {
        name: 'Rustam Olimov',
        bio: 'Blockchain Developer va Smart Contract Auditor. Ethereum va Solana ecosystemda 5+ yillik tajriba. 20+ DeFi loyihalar yaratgan va $100M+ auditlarni o\'tkazgan.',
        email: 'rustam@example.com',
        phone: '+998901234576',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 987,
        categories: 'Blockchain,Solidity,Web3,Smart Contracts,DeFi',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 11 },
      update: {},
      create: {
        name: 'Shoira Karimova',
        bio: 'English Language Expert. CELTA va DELTA sertifikatlari. 12+ yillik xalqaro tajriba. IELTS va TOEFL bo\'yicha mutaxassis. 3000+ talabalar IELTS 7+ ballga erishgan.',
        email: 'shoira@example.com',
        phone: '+998901234577',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        rating: 5.0,
        totalRatings: 5432,
        categories: 'English,IELTS,TOEFL,Academic English,Business English',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 12 },
      update: {},
      create: {
        name: 'Timur Safarov',
        bio: 'Cybersecurity Expert @ Kaspersky Lab. CEH va OSCP sertifikatlari. Ethical hacking va penetration testing bo\'yicha 10+ yillik tajriba. 100+ kompaniyalarga security audit o\'tkazgan.',
        email: 'timur@example.com',
        phone: '+998901234578',
        avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop',
        rating: 4.9,
        totalRatings: 1543,
        categories: 'Cybersecurity,Ethical Hacking,Network Security,Penetration Testing',
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
  
  // Use reliable public sample videos
  const video1 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const video2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
  const video3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const video4 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
  const video5 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
  const video6 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
  const video7 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4';
  const video8 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';
  const video9 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4';
  const video10 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  
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
        url: video1,
        thumbnail: 'https://picsum.photos/seed/flutter1/400/250',
        duration: 360,
        size: BigInt(5510872), // ~5.25 MB
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
        url: video2,
        thumbnail: 'https://picsum.photos/seed/flutter2/400/250',
        duration: 420,
        size: BigInt(7340032), // ~7 MB
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
        url: video3,
        thumbnail: 'https://picsum.photos/seed/flutter3/400/250',
        duration: 540,
        size: BigInt(9437184), // ~9 MB
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
        url: video4,
        thumbnail: 'https://picsum.photos/seed/flutter4/400/250',
        duration: 720,
        size: BigInt(12582912), // ~12 MB
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
        url: video5,
        thumbnail: 'https://picsum.photos/seed/flutter5/400/250',
        duration: 680,
        order: 2,
        isFree: false,
      },
    }),
  ]);
  console.log('✅ Created sections and videos for Flutter course');

  // Create Tests for Course 1 (Multiple tests with different availability)
  console.log('Creating tests for Flutter course...');
  const test1_1 = await prisma.test.create({
    data: {
      courseId: 1,
      title: 'Flutter Asoslari - Boshlang\'ich Test',
      description: 'Kurs sotib olingandan keyin darhol topshirish mumkin',
      duration: 20,
      maxDuration: 60,
      passingScore: 70,
      minCorrectAnswers: 8, // 10 ta savoldan 8 tasi
      availabilityType: 'ANYTIME',
      availableAfterDays: 0,
    },
  });

  const test1_2 = await prisma.test.create({
    data: {
      courseId: 1,
      title: 'Flutter O\'rta Daraja - Haftalik Test',
      description: 'Kurs sotib olingandan 7 kun o\'tgach, har haftada topshirish mumkin',
      duration: 30,
      maxDuration: 60,
      passingScore: 75,
      minCorrectAnswers: 15, // 20 ta savoldan 15 tasi
      availabilityType: 'WEEKLY',
      availableAfterDays: 7,
    },
  });

  const test1_3 = await prisma.test.create({
    data: {
      courseId: 1,
      title: 'Flutter Final Test',
      description: 'Kurs sotib olingandan 14 kun o\'tgach, har 3 kunda topshirish mumkin',
      duration: 45,
      maxDuration: 60,
      passingScore: 80,
      minCorrectAnswers: 18, // 20 ta savoldan 18 tasi certificate uchun
      availabilityType: 'EVERY_3_DAYS',
      availableAfterDays: 14,
    },
  });

  // Create questions for test 1_1 (Boshlang'ich)
  await Promise.all([
    prisma.testQuestion.create({
      data: {
        testId: test1_1.id,
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
        testId: test1_1.id,
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
        testId: test1_1.id,
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

  // Create questions for test 1_2 (O'rta daraja)
  await Promise.all([
    prisma.testQuestion.create({
      data: {
        testId: test1_2.id,
        question: 'State Management nima?',
        options: JSON.stringify([
          'Ma\'lumotlarni boshqarish usuli',
          'Database',
          'API',
          'Widget',
        ]),
        correctAnswer: 0,
        order: 1,
      },
    }),
    prisma.testQuestion.create({
      data: {
        testId: test1_2.id,
        question: 'Provider nima uchun ishlatiladi?',
        options: JSON.stringify([
          'State management uchun',
          'Database uchun',
          'Networking uchun',
          'UI uchun',
        ]),
        correctAnswer: 0,
        order: 2,
      },
    }),
  ]);

  // Create questions for test 1_3 (Final)
  await Promise.all([
    prisma.testQuestion.create({
      data: {
        testId: test1_3.id,
        question: 'Clean Architecture nimani nazarda tutadi?',
        options: JSON.stringify([
          'Kod strukturasini yaxshi tashkil qilish',
          'Kodni tozalash',
          'Bug\'larni tuzatish',
          'Test yozish',
        ]),
        correctAnswer: 0,
        order: 1,
      },
    }),
    prisma.testQuestion.create({
      data: {
        testId: test1_3.id,
        question: 'Repository Pattern nima?',
        options: JSON.stringify([
          'Ma\'lumotlar manbalarini abstraktsiya qilish',
          'Widget yaratish',
          'State management',
          'Animation',
        ]),
        correctAnswer: 0,
        order: 2,
      },
    }),
  ]);
  
  console.log('✅ Created 3 tests with different availability for Flutter course');

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

  // Create Tests for Course 2 (NestJS - 30 va 20 savollik testlar)
  console.log('Creating tests for NestJS course...');
  const test2_1 = await prisma.test.create({
    data: {
      courseId: 2,
      title: 'NestJS Asoslari - Katta Test',
      description: '30 savollik to\'liq test',
      duration: 45,
      maxDuration: 60,
      passingScore: 70,
      minCorrectAnswers: 21, // 30 ta savoldan 21 tasi (70%)
      availabilityType: 'ANYTIME',
      availableAfterDays: 0,
    },
  });

  const test2_2 = await prisma.test.create({
    data: {
      courseId: 2,
      title: 'NestJS O\'rta Daraja - Test',
      description: '20 savollik o\'rta daraja test',
      duration: 30,
      maxDuration: 60,
      passingScore: 75,
      minCorrectAnswers: 15, // 20 ta savoldan 15 tasi (75%)
      availabilityType: 'WEEKLY',
      availableAfterDays: 7,
    },
  });

  // Create 30 questions for test2_1
  const test2_1_questions = [];
  for (let i = 1; i <= 30; i++) {
    test2_1_questions.push(
      prisma.testQuestion.create({
        data: {
          testId: test2_1.id,
          question: `NestJS savol ${i}: NestJS ${i === 1 ? 'nima' : i === 2 ? 'qaysi framework asosida qurilgan' : i === 3 ? 'decorator lardan qaysi biri controller yaratadi' : i === 4 ? 'service larda qaysi decorator ishlatiladi' : i === 5 ? 'dependency injection nimani ta\'minlaydi' : i === 6 ? 'module larda providers nima qiladi' : i === 7 ? 'middleware qachon ishlaydi' : i === 8 ? 'pipes nimalar uchun ishlatiladi' : i === 9 ? 'guards nima uchun kerak' : i === 10 ? 'interceptors qayerda ishlatiladi' : i === 11 ? 'DTO nima' : i === 12 ? 'TypeORM nima' : i === 13 ? 'Prisma nimaga kerak' : i === 14 ? 'JWT nima' : i === 15 ? 'Passport nima qiladi' : i === 16 ? 'GraphQL qaysi transport protokol' : i === 17 ? 'WebSocket qachon ishlatiladi' : i === 18 ? 'Microservices arxitekturasi nima' : i === 19 ? 'ConfigModule nima beradi' : i === 20 ? 'ValidationPipe nima qiladi' : i === 21 ? 'Exception filters qachon ishlatiladi' : i === 22 ? 'Logger service nimaga kerak' : i === 23 ? 'Testing da jest nima' : i === 24 ? 'e2e testing nima' : i === 25 ? 'Swagger nima beradi' : i === 26 ? 'CORS nima' : i === 27 ? 'Rate limiting nimani oldini oladi' : i === 28 ? 'Caching qachon foydali' : i === 29 ? 'Queue lar nimaga kerak' : 'Production deployment da nima muhim'}?`,
          options: JSON.stringify([
            i % 4 === 1 ? 'To\'g\'ri javob' : 'Noto\'g\'ri javob 1',
            i % 4 === 2 ? 'To\'g\'ri javob' : 'Noto\'g\'ri javob 2',
            i % 4 === 3 ? 'To\'g\'ri javob' : 'Noto\'g\'ri javob 3',
            i % 4 === 0 ? 'To\'g\'ri javob' : 'Noto\'g\'ri javob 4',
          ]),
          correctAnswer: (i - 1) % 4,
          order: i,
        },
      })
    );
  }
  await Promise.all(test2_1_questions);

  // Create 20 questions for test2_2
  const test2_2_questions = [];
  for (let i = 1; i <= 20; i++) {
    test2_2_questions.push(
      prisma.testQuestion.create({
        data: {
          testId: test2_2.id,
          question: `NestJS o'rta savol ${i}: ${i === 1 ? 'Controller decorator parametrlari nimani belgilaydi' : i === 2 ? 'Async/await nima uchun kerak' : i === 3 ? 'Request lifecycle qanday ishlaydi' : i === 4 ? 'Custom decorator qanday yaratiladi' : i === 5 ? 'Database transaction nimaga kerak' : i === 6 ? 'Error handling eng yaxshi usuli' : i === 7 ? 'Serialization nima qiladi' : i === 8 ? 'Request validation qanday qilinadi' : i === 9 ? 'File upload qanday qabul qilinadi' : i === 10 ? 'Response transformation nima' : i === 11 ? 'Custom pipes qanday yaratiladi' : i === 12 ? 'Global middleware qanday qo\'shiladi' : i === 13 ? 'Authentication strategy nima' : i === 14 ? 'Authorization guard qanday ishlaydi' : i === 15 ? 'Custom repository pattern' : i === 16 ? 'Event emitter nima uchun' : i === 17 ? 'Schedule tasks qanday' : i === 18 ? 'Health checks nimaga kerak' : i === 19 ? 'Dynamic modules nima' : 'Circular dependency muammosi'}?`,
          options: JSON.stringify([
            i % 4 === 1 ? 'To\'g\'ri javob varianti' : 'Xato javob 1',
            i % 4 === 2 ? 'To\'g\'ri javob varianti' : 'Xato javob 2',
            i % 4 === 3 ? 'To\'g\'ri javob varianti' : 'Xato javob 3',
            i % 4 === 0 ? 'To\'g\'ri javob varianti' : 'Xato javob 4',
          ]),
          correctAnswer: (i - 1) % 4,
          order: i,
        },
      })
    );
  }
  await Promise.all(test2_2_questions);
  
  console.log('✅ Created 2 tests with 30 and 20 questions for NestJS course');

  // Create Videos for other courses (shorter version)
  console.log('Creating videos for other courses...');
  
  // Use public sample videos
  const sampleVideos = [
    video6, video7, video8, video9, video10
  ];
  
  for (const course of courses.slice(1)) {
    const section = await prisma.section.create({
      data: {
        courseId: course.id,
        title: 'Boshlang\'ich qism',
        order: 1,
        isFree: true,
      },
    });

    const videoIndex = course.id % sampleVideos.length;
    
    await Promise.all([
      prisma.video.create({
        data: {
          courseId: course.id,
          sectionId: section.id,
          title: 'Kirish',
          url: sampleVideos[videoIndex],
          thumbnail: course.thumbnail,
          duration: 30,
          order: 1,
          isFree: true,
        },
      }),
      prisma.video.create({
        data: {
          courseId: course.id,
          sectionId: section.id,
          title: 'Asosiy tushunchalar',
          url: sampleVideos[(videoIndex + 1) % sampleVideos.length],
          thumbnail: course.thumbnail,
          duration: 30,
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

  // Create Notifications for all users
  console.log('Creating notifications...');
  const allUsers = await prisma.user.findMany();
  
  for (const user of allUsers) {
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Xush kelibsiz!',
          message: 'Platformamizga xush kelibsiz! Eng yaxshi kurslarni o\'rganing.',
          type: 'course',
          icon: 'school',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop',
          link: '/courses',
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Yangi kurs qo\'shildi',
          message: 'Flutter Development kursi sizga mos keladi. Hoziroq boshlang!',
          type: 'course',
          icon: 'school',
          image: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=400&h=200&fit=crop',
          link: '/courses/1',
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Maxsus chegirma!',
          message: 'Barcha kurslarga 20% chegirma! Faqat 3 kun.',
          type: 'discount',
          icon: 'discount',
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop',
          link: '/courses',
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Yangi video darslar',
          message: 'Backend Development kursiga 5 ta yangi video dars qo\'shildi',
          type: 'video',
          icon: 'play_circle',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop',
          link: '/courses/2',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Balans to\'ldirish uchun bonus!',
          message: '100,000 so\'m va undan ko\'proq to\'ldirsangiz 10% bonus oling!',
          type: 'discount',
          icon: 'discount',
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop',
          link: '/profile/balance',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
      }),
    ]);
  }
  console.log('✅ Created notifications for all users');

  // Create Payments
  console.log('Creating test payments...');
  await Promise.all([
    // Balance topups
    prisma.payment.create({
      data: {
        userId: testUser.id,
        amount: 500000,
        method: 'CLICK',
        type: 'BALANCE_TOPUP',
        status: 'SUCCESS',
        transactionId: 'TOPUP_CLK_' + Date.now() + '_1',
        paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      },
    }),
    prisma.payment.create({
      data: {
        userId: testUser.id,
        amount: 300000,
        method: 'PAYME',
        type: 'BALANCE_TOPUP',
        status: 'SUCCESS',
        transactionId: 'TOPUP_PAYME_' + Date.now() + '_2',
        paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
    }),
    // Course purchases
    prisma.payment.create({
      data: {
        userId: testUser.id,
        courseId: 1,
        amount: 250000,
        method: 'BALANCE',
        type: 'COURSE_PURCHASE',
        status: 'SUCCESS',
        transactionId: 'BAL_' + Date.now() + '_1',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    }),
    prisma.payment.create({
      data: {
        userId: testUser.id,
        courseId: 2,
        amount: 300000,
        method: 'PAYME',
        type: 'COURSE_PURCHASE',
        status: 'SUCCESS',
        transactionId: 'PAYME_' + Date.now() + '_3',
        paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
    }),
    prisma.payment.create({
      data: {
        userId: testUser.id,
        courseId: 3,
        amount: 200000,
        method: 'UZUM',
        type: 'COURSE_PURCHASE',
        status: 'SUCCESS',
        transactionId: 'UZUM_' + Date.now() + '_4',
        paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
    }),
  ]);
  console.log('✅ Created test payments');

  // Update user balance (500000 + 300000 - 250000 = 550000)
  await prisma.user.update({
    where: { id: testUser.id },
    data: { balance: 550000 },
  });
  console.log('✅ Updated user balance');

  // Create Promo Codes
  console.log('Creating promo codes...');
  const promoCodes = await Promise.all([
    prisma.promoCode.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        discountPercent: 10,
        type: 'USER_SINGLE_USE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        isActive: true,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'NEWUSER20' },
      update: {},
      create: {
        code: 'NEWUSER20',
        discountPercent: 20,
        type: 'USER_SINGLE_USE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        isActive: true,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'SALE50' },
      update: {},
      create: {
        code: 'SALE50',
        discountPercent: 50,
        type: 'SINGLE_USE',
        maxUsageCount: 1,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        isActive: true,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'FIRST15' },
      update: {},
      create: {
        code: 'FIRST15',
        discountPercent: 15,
        type: 'USER_SINGLE_USE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        isActive: true,
      },
    }),
    // Summalik promocode'lar
    prisma.promoCode.upsert({
      where: { code: 'SAVE50000' },
      update: {},
      create: {
        code: 'SAVE50000',
        discountAmount: 50000,
        type: 'USER_SINGLE_USE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        isActive: true,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'GIFT100000' },
      update: {},
      create: {
        code: 'GIFT100000',
        discountAmount: 100000,
        type: 'SINGLE_USE',
        maxUsageCount: 1,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${promoCodes.length} promo codes`);

  // Create Notifications for test user
  console.log('Creating notifications...');
  const notifications = await Promise.all([
    prisma.notification.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Yangi kurs qo\'shildi!',
        message: 'Flutter Mobile Development kursi hozir mavjud. 30% chegirma bilan sotib oling!',
        type: 'course',
        icon: 'mdi:school',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        link: '/courses/1',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Maxsus chegirma!',
        message: 'SALE50 promo kodi bilan 50% chegirma oling. Faqat bugun!',
        type: 'discount',
        icon: 'mdi:sale',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
        link: '/promo/SALE50',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 3 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Yangi dars qo\'shildi',
        message: 'Flutter kursingizga 5 ta yangi video dars qo\'shildi. Ko\'rib chiqing!',
        type: 'video',
        icon: 'mdi:video',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
        link: '/courses/1/videos',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 4 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Sertifikat tayyor!',
        message: 'Flutter Mobile Development kursi uchun sertifikatingiz tayyor. Yuklab oling!',
        type: 'certificate',
        icon: 'mdi:certificate',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        link: '/certificates/1',
        isRead: true,
      },
    }),
    prisma.notification.upsert({
      where: { id: 5 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'React.js kursi boshlanmoqda',
        message: 'Siz yozilgan React.js Advanced kursi 3 kundan keyin boshlanadi. Tayyorlaning!',
        type: 'course',
        icon: 'mdi:react',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        link: '/courses/2',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 6 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Balansga pul qo\'shildi',
        message: 'Hisobingizga 500,000 so\'m qo\'shildi. Endi yangi kurslar sotib olishingiz mumkin!',
        type: 'payment',
        icon: 'mdi:wallet',
        link: '/profile/balance',
        isRead: true,
      },
    }),
    prisma.notification.upsert({
      where: { id: 7 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Yangi ustoz qo\'shildi',
        message: 'Sherzod Turdibekov - Python Senior Developer platformaga qo\'shildi. Kurslarini ko\'ring!',
        type: 'teacher',
        icon: 'mdi:account-tie',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        link: '/teachers/5',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 8 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Testdan o\'tdingiz!',
        message: 'Flutter asoslari testidan 95/100 ball bilan o\'tdingiz. Ajoyib natija!',
        type: 'test',
        icon: 'mdi:clipboard-check',
        link: '/tests/results/1',
        isRead: true,
      },
    }),
    prisma.notification.upsert({
      where: { id: 9 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Tug\'ilgan kuningiz muborak!',
        message: 'Tug\'ilgan kuningiz munosabati bilan 20% chegirma sovg\'asi! BIRTHDAY20 kodini ishlating.',
        type: 'special',
        icon: 'mdi:cake-variant',
        link: '/promo/BIRTHDAY20',
        isRead: false,
      },
    }),
    prisma.notification.upsert({
      where: { id: 10 },
      update: {},
      create: {
        userId: testUser.id,
        title: 'Yangilanish mavjud',
        message: 'Ilova versiyasi 2.0 chiqdi. Yangi xususiyatlar va tezkor ishlash!',
        type: 'system',
        icon: 'mdi:update',
        link: '/updates',
        isRead: false,
      },
    }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

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
