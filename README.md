# Course Platform - Backend (NestJS)

Online kurs platformasi backend qismi. NestJS, Prisma, MySQL bilan qurilgan.

## Texnologiyalar

- **NestJS** - Backend framework
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File upload

## O'rnatish

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. MySQL Database yaratish
MySQL serverda `course_platform` nomli database yarating:
```sql
CREATE DATABASE course_platform;
```

### 3. Environment sozlash
`.env` faylini tahrirlang:
```env
DATABASE_URL="mysql://root:password@localhost:3306/course_platform"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000

# CORS - Production originlarini qo'shish uchun (ixtiyoriy)
# ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

### 4. Prisma migration va generate
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Serverni ishga tushirish
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server http://localhost:3000 da ishga tushadi.

## CORS Konfiguratsiyasi

Backend serveri web (brauzer) va mobil ilovalardan so'rovlarni qabul qilish uchun CORS (Cross-Origin Resource Sharing) sozlangan:

### Ruxsat berilgan web originlar:
- `http://localhost:8080` - Asosiy frontend ilovasi
- `http://localhost:3000` - Alternative development port
- `http://localhost:3001` - Additional development port
- `http://127.0.0.1:8080` - IPv4 localhost
- `http://127.0.0.1:3000` - IPv4 localhost
- `http://127.0.0.1:3001` - IPv4 localhost

### Mobil ilovalar:
- Mobil native ilovalar (Android/iOS) to'g'ridan-to'g'ri API ga murojaat qilishi mumkin
- Mobil brauzer va WebView'lar uchun ham CORS qo'llab-quvvatlanadi

### Production uchun:
Production muhitida qo'shimcha web originlarini qo'shish uchun `.env` faylida `ALLOWED_ORIGINS` environment variable'ini sozlang:
```env
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

**Muhim:** Mobil native ilovalar (Origin header yubormaydigan) har doim ruxsat etiladi. Browser-based ilovalar faqat ro'yxatdagi originlardan murojaat qilishi mumkin.

## API Endpoints

### Authentication
- `POST /auth/send-code` - SMS kod yuborish
- `POST /auth/verify-code` - Kodni tekshirish (test: 666666)
- `PATCH /auth/complete-profile` - Profilni to'ldirish (JWT kerak)
- `GET /auth/profile` - Profil ma'lumotlari (JWT kerak)

### Courses
- `GET /courses` - Barcha kurslar
- `GET /courses/:id` - Kurs detallari
- `POST /courses/:id/save` - Kursni saqlash (JWT)
- `GET /courses/saved/list` - Saqlangan kurslar (JWT)
- `POST /courses/:id/feedback` - Feedback qoldirish (JWT)

### Teachers
- `GET /teachers` - Barcha o'qituvchilar
- `GET /teachers/:id` - O'qituvchi ma'lumotlari

### Categories
- `GET /categories` - Kategoriyalar
- `GET /categories/:id` - Kategoriya bo'yicha kurslar

### Payments
- `POST /payments` - To'lov yaratish (JWT)
- `POST /payments/:id/confirm` - To'lovni tasdiqlash (JWT)
- `GET /payments/history` - To'lovlar tarixi (JWT)

### Upload
- `POST /upload/image` - Rasm yuklash (JWT)
- `POST /upload/video` - Video yuklash (JWT)

## Test Ma'lumotlari

- **SMS verification code**: `666666` (test uchun)
- **Token muddati**: 7 kun

## Loyiha Strukturasi

```
src/
├── auth/              # Authentication moduli
├── user/              # User moduli
├── course/            # Course moduli
├── teacher/           # Teacher moduli
├── category/          # Category moduli
├── payment/           # Payment moduli
├── upload/            # File upload moduli
├── prisma/            # Prisma service
├── app.module.ts      # Root module
└── main.ts            # Entry point
```

## Prisma Studio

Database'ni ko'rish uchun:
```bash
npm run prisma:studio
```

http://localhost:5555 da ochiladi.

## Admin Yaratish / Creating Admin

Tizimda admin yaratish uchun maxsus script mavjud. Script interaktiv bo'lib, login, parol, telefon va rol kabi ma'lumotlarni so'raydi.

### Admin yaratish buyrug'i:
```bash
npm run create-admin
```

### Script ishlashi:
1. Login kiritish (noyob bo'lishi kerak)
2. Telefon raqam kiritish (+998XXXXXXXXX formatida, noyob)
3. Parol kiritish
4. To'liq ism kiritish (ixtiyoriy)
5. Rol tanlash:
   - `1` - SUPER_ADMIN (Barcha huquqlar)
   - `2` - ADMIN (Administrator)
   - `3` - MODERATOR (Moderator)

### Misol:
```bash
$ npm run create-admin

🔧 Admin Yaratish / Create Admin

═══════════════════════════════════════

Login kiriting / Enter login: admin1
Telefon raqam kiriting (+998XXXXXXXXX) / Enter phone number (+998XXXXXXXXX): +998901234567
Parol kiriting / Enter password: mypassword123
To'liq ism kiriting / Enter full name (optional): John Doe

Rol tanlang / Choose role:
1. SUPER_ADMIN (Barcha huquqlar / All permissions)
2. ADMIN (Administrator)
3. MODERATOR (Moderator)
Raqam kiriting / Enter number (1-3): 2

⏳ Admin yaratilmoqda / Creating admin...

✅ Admin muvaffaqiyatli yaratildi! / Admin created successfully!

═══════════════════════════════════════
ID: 1
Login: admin1
Phone: +998901234567
Full Name: John Doe
Role: ADMIN
Status: Active
═══════════════════════════════════════
```

### Root Admin
Agar root admin (SUPER_ADMIN) yaratish kerak bo'lsa, quyidagi buyruq bilan ham yaratishingiz mumkin:
```bash
npx ts-node create-root-admin.ts
```
Bu script default qiymatlar bilan root admin yaratadi:
- Login: `root`
- Phone: `+998901234567`
- Password: `root123`
- Role: `SUPER_ADMIN`
