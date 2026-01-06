import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Barcha enrollmentlarni o\'chirish boshlandi...\n');

  // Hozirgi enrollmentlar sonini ko'rsatish
  const count = await prisma.enrollment.count();
  console.log(`📊 Hozirgi enrollmentlar soni: ${count}\n`);

  if (count === 0) {
    console.log('✅ Enrollmentlar allaqachon bo\'sh\n');
    return;
  }

  // Barcha enrollmentlarni o'chirish
  const result = await prisma.enrollment.deleteMany({});
  
  console.log(`✅ ${result.count} ta enrollment o'chirildi!\n`);
  console.log('🎉 Faol kurslar tozalandi!\n');
}

main()
  .catch((e) => {
    console.error('❌ Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
