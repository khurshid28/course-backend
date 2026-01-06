import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAvatar() {
  const userId = 2;
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: '/uploads/images/processed_1767733359727-scaled_1000010804.jpg',
    },
  });

  console.log('Avatar updated:', updated.avatar);
  await prisma.$disconnect();
}

fixAvatar().catch(console.error);
