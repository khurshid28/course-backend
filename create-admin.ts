import { PrismaClient, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n🔧 Admin Yaratish / Create Admin\n');
    console.log('═══════════════════════════════════════\n');

    // Get admin details from user
    const login = await question('Login kiriting / Enter login: ');
    if (!login || login.trim() === '') {
      console.log('❌ Login bo\'sh bo\'lmasligi kerak / Login cannot be empty');
      process.exit(1);
    }

    // Check if admin with this login already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { login: login.trim() },
    });

    if (existingAdmin) {
      console.log(`❌ "${login}" login bilan admin allaqachon mavjud / Admin with login "${login}" already exists!`);
      process.exit(1);
    }

    const phone = await question('Telefon raqam kiriting (+998XXXXXXXXX) / Enter phone number (+998XXXXXXXXX): ');
    if (!phone || phone.trim() === '') {
      console.log('❌ Telefon raqam bo\'sh bo\'lmasligi kerak / Phone number cannot be empty');
      process.exit(1);
    }

    // Check if admin with this phone already exists
    const existingPhone = await prisma.admin.findUnique({
      where: { phone: phone.trim() },
    });

    if (existingPhone) {
      console.log(`❌ "${phone}" telefon raqam bilan admin allaqachon mavjud / Admin with phone "${phone}" already exists!`);
      process.exit(1);
    }

    const password = await question('Parol kiriting / Enter password: ');
    if (!password || password.trim() === '') {
      console.log('❌ Parol bo\'sh bo\'lmasligi kerak / Password cannot be empty');
      process.exit(1);
    }

    const fullName = await question('To\'liq ism kiriting / Enter full name (optional): ');

    console.log('\nRol tanlang / Choose role:');
    console.log('1. SUPER_ADMIN (Barcha huquqlar / All permissions)');
    console.log('2. ADMIN (Administrator)');
    console.log('3. MODERATOR (Moderator)');
    const roleChoice = await question('Raqam kiriting / Enter number (1-3): ');

    let role: AdminRole;
    switch (roleChoice.trim()) {
      case '1':
        role = AdminRole.SUPER_ADMIN;
        break;
      case '2':
        role = AdminRole.ADMIN;
        break;
      case '3':
        role = AdminRole.MODERATOR;
        break;
      default:
        console.log('❌ Noto\'g\'ri tanlov, ADMIN roli belgilandi / Invalid choice, defaulting to ADMIN role');
        role = AdminRole.ADMIN;
    }

    // Hash password
    console.log('\n⏳ Admin yaratilmoqda / Creating admin...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        login: login.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        fullName: fullName.trim() || undefined,
        role: role,
        isActive: true,
      },
    });

    console.log('\n✅ Admin muvaffaqiyatli yaratildi! / Admin created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log(`ID: ${admin.id}`);
    console.log(`Login: ${admin.login}`);
    console.log(`Phone: ${admin.phone}`);
    console.log(`Full Name: ${admin.fullName || 'N/A'}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Xatolik / Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
