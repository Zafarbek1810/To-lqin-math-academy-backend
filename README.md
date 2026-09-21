# To'lqinbek Math Academy — NestJS Backend

PostgreSQL + TypeORM + NestJS API.

## 1. PostgreSQL ni ishga tushirish

### Variant A — Docker (tavsiya etiladi)

```bash
cd bekend
docker compose up -d
```

### Variant B — mahalliy PostgreSQL

PostgreSQL o'rnatilgan bo'lishi kerak. Keyin bazani yarating:

```sql
CREATE DATABASE tolqin;
```

## 2. Muhit o'zgaruvchilari

```bash
cp .env.example .env
```

`.env` faylidagi qiymatlarni o'zingizning PostgreSQL sozlamalaringizga moslang.

## 3. Backend ni ishga tushirish

```bash
cd bekend
npm install
npm run start:dev
```

API: `http://localhost:3000/api`

Birinchi ishga tushganda jadvallar avtomatik yaratiladi (`DB_SYNC=true`) va faqat `admin` akkaunti yaratiladi.

## DBeaver orqali ulanish

| Maydon | Qiymat |
|--------|--------|
| Database | PostgreSQL |
| Host | `localhost` |
| Port | `5432` |
| Database | `tolqin` |
| Username | `postgres` |
| Password | `postgres` (`.env` dagi `DB_PASSWORD`) |

**Test Connection** → **Finish**. Chap panelda `tolqin` bazasidagi jadvallarni ko'rasiz.

## Login

| Username | Parol | Rol   |
|----------|-------|-------|
| admin    | 123   | Admin |

## Asosiy endpointlar

- `POST /api/auth/login` — kirish
- `GET  /api/auth/me` — joriy foydalanuvchi
- `GET  /api/users/employees` — xodimlar
- `CRUD /api/subjects` — fanlar
- `CRUD /api/groups` — guruhlar (`?mine=1` o'qituvchi uchun)
- `CRUD /api/students` — talabalar
- `POST /api/lessons` — dars saqlash (davomat + mukofot + 24 soat lock)
- `CRUD /api/exams` + `POST /api/exams/:id/results`
- `CRUD /api/products` — do'kon
- `POST /api/orders` — mukofot bilan xarid
- `CRUD /api/payments` — kassa
- `GET  /api/dashboard/stats` — admin dashboard

Barcha endpointlar (login dan tashqari) `Authorization: Bearer <token>` talab qiladi.

## Muhit o'zgaruvchilari

| O'zgaruvchi | Default | Tavsif |
|-------------|---------|--------|
| `DB_HOST` | `localhost` | PostgreSQL server |
| `DB_PORT` | `5432` | Port |
| `DB_USER` | `postgres` | Foydalanuvchi |
| `DB_PASSWORD` | `postgres` | Parol |
| `DB_NAME` | `tolqin` | Baza nomi |
| `DB_SYNC` | `true` | Jadval sxemasini avtomatik yangilash (production da `false`) |
| `PORT` | `3000` | API porti |
| `JWT_SECRET` | — | JWT token kaliti |
