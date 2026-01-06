import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Kurs #3 uchun test qo\'shish boshlandi...\n');

  // Kurs mavjudligini tekshirish
  const course = await prisma.course.findUnique({
    where: { id: 3 },
    select: { id: true, title: true },
  });

  if (!course) {
    console.log('❌ Kurs #3 topilmadi!\n');
    return;
  }

  console.log(`✅ Kurs topildi: ${course.title}\n`);

  // Test yaratish
  const test = await prisma.test.create({
    data: {
      title: `${course.title} - Boshlang'ich test`,
      description: 'Kurs bo\'yicha bilimingizni sinab ko\'ring',
      courseId: 3,
      duration: 30,
      maxDuration: 30, // 30 daqiqa
      passingScore: 70, // 70% o'tish bali
      minCorrectAnswers: 7, // 10 tadan 7 ta to'g'ri
      availabilityType: 'ANYTIME',
      availableAfterDays: 0,
      isActive: true,
      questions: {
        create: [
          {
            question: 'Dasturlash nima?',
            options: JSON.stringify([
              'Kompyuterga buyruqlar berish',
              'O\'yin o\'ynash',
              'Internetda surish',
              'Telefonda gaplashish'
            ]),
            correctAnswer: 0,
            order: 1,
          },
          {
            question: 'Frontend nima?',
            options: JSON.stringify([
              'Backend kod',
              'Foydalanuvchi ko\'radigan qism',
              'Database',
              'Server'
            ]),
            correctAnswer: 1,
            order: 2,
          },
          {
            question: 'Backend nima?',
            options: JSON.stringify([
              'Foydalanuvchi interfeysi',
              'Dizayn',
              'Server tomonidagi mantiq',
              'Mobil app'
            ]),
            correctAnswer: 2,
            order: 3,
          },
          {
            question: 'API nima?',
            options: JSON.stringify([
              'Dasturlash tili',
              'Ilova va server o\'rtasida aloqa',
              'Database',
              'Framework'
            ]),
            correctAnswer: 1,
            order: 4,
          },
          {
            question: 'HTML nima uchun ishlatiladi?',
            options: JSON.stringify([
              'Stillar uchun',
              'Veb sahifa tuzilishi uchun',
              'Animatsiya uchun',
              'Ma\'lumotlar bazasi uchun'
            ]),
            correctAnswer: 1,
            order: 5,
          },
          {
            question: 'CSS nima uchun ishlatiladi?',
            options: JSON.stringify([
              'Sahifa tuzilishi uchun',
              'Stillar va dizayn uchun',
              'Ma\'lumotlar saqlash uchun',
              'Server bilan ishlash uchun'
            ]),
            correctAnswer: 1,
            order: 6,
          },
          {
            question: 'JavaScript nima qiladi?',
            options: JSON.stringify([
              'Faqat dizayn',
              'Dinamik funksiyalar qo\'shadi',
              'Faqat ma\'lumot saqlaydi',
              'Hech narsa'
            ]),
            correctAnswer: 1,
            order: 7,
          },
          {
            question: 'Database nima?',
            options: JSON.stringify([
              'Dizayn fayli',
              'Ma\'lumotlar saqlash tizimi',
              'Dasturlash tili',
              'Veb sahifa'
            ]),
            correctAnswer: 1,
            order: 8,
          },
          {
            question: 'Framework nima?',
            options: JSON.stringify([
              'Database',
              'Tayyor kod kutubxonasi',
              'Server',
              'Kompyuter'
            ]),
            correctAnswer: 1,
            order: 9,
          },
          {
            question: 'Git nima uchun ishlatiladi?',
            options: JSON.stringify([
              'Kod dizayni uchun',
              'Kod versiyalarini boshqarish uchun',
              'Ma\'lumotlar saqlash uchun',
              'Server sozlash uchun'
            ]),
            correctAnswer: 1,
            order: 10,
          },
        ],
      },
    },
  });

  // Savollarni olish
  const questions = await prisma.testQuestion.findMany({
    where: { testId: test.id },
    orderBy: { order: 'asc' },
  });

  console.log(`✅ Test yaratildi: ${test.title}`);
  console.log(`📝 Savollar soni: ${questions.length}`);
  console.log(`⏱️  Vaqt: ${test.maxDuration} daqiqa`);
  console.log(`📊 O'tish bali: ${test.passingScore}%`);
  console.log('\n🎉 Test muvaffaqiyatli qo\'shildi!\n');

  // Savollarni ko'rsatish
  console.log('📋 TO\'G\'RI JAVOBLAR:');
  console.log('═'.repeat(50));
  questions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.question}`);
    console.log(`   ✅ To'g'ri javob: ${q.correctAnswer}`);
  });
  console.log('═'.repeat(50) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
