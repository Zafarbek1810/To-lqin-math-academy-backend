# To'lqinbek Math Academy — NestJS Backend

## Ishga tushirish

```bash
cd backend
npm install
npm run start:dev
```

API: `http://localhost:3000/api`

## Demo login

| Username   | Parol | Rol        |
|------------|-------|------------|
| admin      | 123   | Admin      |
| reception  | 123   | Reception  |
| teacher    | 123   | Teacher    |

## Asosiy endpointlar

- `POST /api/auth/login` — kirish
- `GET  /api/auth/me` — joriy foydalanuvchi
- `GET  /api/users/employees` — xodimlar
- `CRUD /api/subjects` — fanlar
- `CRUD /api/groups` — guruhlar (`?mine=1` o‘qituvchi uchun)
- `CRUD /api/students` — talabalar
- `POST /api/lessons` — dars saqlash (davomat + mukofot + 24 soat lock)
- `CRUD /api/exams` + `POST /api/exams/:id/results`
- `CRUD /api/products` — do‘kon
- `POST /api/orders` — mukofot bilan xarid
- `CRUD /api/payments` — kassa
- `GET  /api/dashboard/stats` — admin dashboard

Barcha endpointlar (login dan tashqari) `Authorization: Bearer <token>` talab qiladi.
