# 🚀 Backend Ishga Tushirish Qo'llanmasi

## 1. MySQL O'rnatish va Sozlash

### Windows uchun:
1. MySQL Server yuklab oling: https://dev.mysql.com/downloads/installer/
2. MySQL Installer ni ishga tushiring
3. "MySQL Server" ni tanlang va o'rnating
4. Root parol o'rnating (masalan: `password`)

### MySQL Serverni Ishga Tushirish:
```bash
# Windows Services orqali
# Win + R > services.msc > MySQL80 > Start

# Yoki command line orqali
net start MySQL80
```

## 2. Database Yaratish

MySQL Workbench yoki command line orqali:

```sql
CREATE DATABASE course_platform;
```

Yoki command line:
```bash
mysql -u root -p
# Parol kiriting
CREATE DATABASE course_platform;
EXIT;
```

## 3. .env Faylni Sozlash

`course-backend/.env` faylini tekshiring:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/course_platform"
```

**Muhim**: `your_password` ni o'zingizning MySQL root parolingizga almashtiring!

## 4. Prisma Migration

```bash
cd course-backend

# Prisma client generate
npx prisma generate

# Migration yaratish va ishga tushirish
npx prisma migrate dev --name init

# Yoki agar migration allaqachon bo'lsa
npx prisma migrate deploy
```

## 5. Seed Data Yuklash

```bash
npm run seed
```

Bu quyidagilarni yaratadi:
- ✅ 5 ta kategoriya (IT, Dizayn, Biznes, Tillar, Marketing)
- ✅ 3 ta o'qituvchi (avatarlar bilan)
- ✅ 5 ta kurs (rasmlar bilan)
- ✅ Har bir kurs uchun 3 ta video
- ✅ Test user (+998901234560, kod: 666666)
- ✅ Enrollment va feedback namunalari

## 6. Backend Serverni Ishga Tushirish

```bash
npm run start:dev
```

Server http://localhost:3000 da ishga tushadi.

## 7. Test Qilish

### Health Check:
```bash
curl http://localhost:3000
```

### API Endpoints:
- GET http://localhost:3000/courses - Barcha kurslar
- GET http://localhost:3000/teachers - O'qituvchilar
- GET http://localhost:3000/categories - Kategoriyalar
- POST http://localhost:3000/auth/send-code - SMS yuborish

### Postman yoki Thunder Client bilan test qiling:

#### 1. SMS Kod Yuborish
```http
POST http://localhost:3000/auth/send-code
Content-Type: application/json

{
  "phone": "+998901234567"
}
```

#### 2. Kodni Tekshirish
```http
POST http://localhost:3000/auth/verify-code
Content-Type: application/json

{
  "phone": "+998901234567",
  "code": "666666"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... },
  "isProfileComplete": false
}
```

#### 3. Token bilan Kurslarni Olish
```http
GET http://localhost:3000/courses
Authorization: Bearer YOUR_TOKEN_HERE
```

## 8. Prisma Studio (Database UI)

```bash
npx prisma studio
```

http://localhost:5555 da Prisma Studio ochiladi.
Database ni vizual ko'rish va tahrirlash mumkin.

## 9. Muammolarni Hal Qilish

### MySQL ulanmayapti:
1. MySQL service ishayotganligini tekshiring
2. .env faylda parol to'g'riligini tekshiring
3. Port 3306 ochiq ekanligini tekshiring

### Migration error:
```bash
# Migration reset
npx prisma migrate reset

# Yangi migration
npx prisma migrate dev --name init
```

### Prisma client error:
```bash
npx prisma generate
```

## 10. Production uchun

```bash
# Build
npm run build

# Production mode
npm run start:prod
```

## Seed Data Ma'lumotlari

### Test User:
- Phone: +998901234560
- Code: 666666
- Avatar: https://i.pravatar.cc/300?img=68

### O'qituvchilar:
1. Akmal Ergashev (Flutter)
2. Dilshod Karimov (Backend)
3. Nigora Saidova (UI/UX)

### Kurslar:
1. Flutter Development - 250,000 so'm
2. NestJS Backend - 300,000 so'm
3. Python Foundation - Bepul
4. UI/UX Design - 200,000 so'm
5. React Native - 280,000 so'm

Barcha kurslar thumbnail rasmlarga ega!

---

**Tayyor!** Backend ishga tushdi va seed data yuklandi! 🎉
