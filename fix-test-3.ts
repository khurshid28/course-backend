import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Toggle isActive to force refresh
  await prisma.test.updateMany({
    where: { courseId: 3 },
    data: { isActive: false },
  });
  
  console.log('Set test to inactive');
  
  await prisma.test.updateMany({
    where: { courseId: 3 },
    data: { isActive: true },
  });
  
  console.log('Set test back to active');
  
  // Verify
  const test = await prisma.test.findFirst({
    where: { courseId: 3 },
    select: {
      id: true,
      title: true,
      availableAfterDays: true,
      availabilityType: true,
      isActive: true,
    },
  });
  
  console.log('\nTest data:', test);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
