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
