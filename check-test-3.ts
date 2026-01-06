import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const test = await prisma.test.findFirst({
    where: { courseId: 3 },
    select: {
      id: true,
      title: true,
      availableAfterDays: true,
      availabilityType: true,
    },
  });

  console.log('Test data from database:');
  console.log(JSON.stringify(test, null, 2));
  console.log('\nType of availableAfterDays:', typeof test?.availableAfterDays);
  console.log('Type of availabilityType:', typeof test?.availabilityType);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
