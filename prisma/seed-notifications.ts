import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔔 Starting notification seed...');

  // Get all users
  const allUsers = await prisma.user.findMany();
  console.log(`Found ${allUsers.length} users`);

  // Get first 5 courses for links
  const courses = await prisma.course.findMany({
    take: 5,
    orderBy: { id: 'asc' },
  });
  console.log(`Found ${courses.length} courses`);

  // Delete existing notifications
  await prisma.notification.deleteMany({});
  console.log('✅ Cleared existing notifications');

  // Create notifications for each user
  for (const user of allUsers) {
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Xush kelibsiz! 🎉',
          message: 'Platformamizga xush kelibsiz! Eng yaxshi kurslarni o\'rganing.',
          type: 'course',
          icon: 'school',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop',
          link: courses[0] ? `/courses/${courses[0].id}` : '/courses',
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
          link: courses[1] ? `/courses/${courses[1].id}` : '/courses',
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Maxsus chegirma! 💰',
          message: 'Barcha kurslarga 20% chegirma! Faqat 3 kun.',
          type: 'discount',
          icon: 'discount',
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop',
          link: courses[2] ? `/courses/${courses[2].id}` : '/courses',
          isRead: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Yangi video darslar 🎥',
          message: 'Backend Development kursiga 5 ta yangi video dars qo\'shildi',
          type: 'video',
          icon: 'play_circle',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop',
          link: courses[3] ? `/courses/${courses[3].id}` : '/courses',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Balans to\'ldirish uchun bonus! 🎁',
          message: '100,000 so\'m va undan ko\'proq to\'ldirsangiz 10% bonus oling!',
          type: 'discount',
          icon: 'discount',
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop',
          link: courses[4] ? `/courses/${courses[4].id}` : '/courses',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
      }),
    ]);
    console.log(`✅ Created 5 notifications for user ${user.id}`);
  }

  console.log(`✅ Successfully created notifications for ${allUsers.length} users`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding notifications:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
