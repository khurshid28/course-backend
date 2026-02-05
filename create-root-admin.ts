import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createRootAdmin() {
  try {
    // Check if root admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { login: 'root' },
    });

    if (existingAdmin) {
      console.log('Root admin already exists!');
      return;
    }

    // Create root admin
    const hashedPassword = await bcrypt.hash('root123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        login: 'root',
        phone: '+998901234567',
        password: hashedPassword,
        fullName: 'Super Administrator',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Root admin created successfully!');
    console.log('Login: root');
    console.log('Password: root123');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error creating root admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRootAdmin();
