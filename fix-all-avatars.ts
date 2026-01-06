import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllAvatars() {
  // Get all users with scaled_ avatars
  const users = await prisma.user.findMany({
    where: {
      avatar: {
        contains: 'scaled_',
      },
    },
  });

  console.log(`Found ${users.length} users with scaled_ avatars`);

  for (const user of users) {
    if (user.avatar) {
      // Replace filename with processed_ version
      const newAvatar = user.avatar.replace(
        /\/([^/]+)$/,
        '/processed_$1',
      );

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: newAvatar },
        });
        console.log(`✅ Updated user ${user.id}: ${user.avatar} -> ${newAvatar}`);
      } catch (error) {
        console.log(`❌ Failed to update user ${user.id}: ${error.message}`);
      }
    }
  }

  await prisma.$disconnect();
  console.log('Done!');
}

fixAllAvatars().catch(console.error);
