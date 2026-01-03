const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany();
  console.log('=== All Users ===');
  users.forEach(u => {
    console.log(`ID: ${u.id}, Phone: ${u.phone}, Name: ${u.firstName} ${u.surname}`);
  });
  
  const notifications = await prisma.notification.findMany({
    include: { user: true }
  });
  console.log('\n=== All Notifications ===');
  notifications.forEach(n => {
    console.log(`ID: ${n.id}, User: ${n.user.firstName} (ID: ${n.userId}), Title: ${n.title}`);
  });
  
  await prisma.$disconnect();
}

checkUsers();
