# EduUz - Milliy Darajadagi Maktab Boshqaruv Tizimi

O'zbekiston bo'ylab maktablarni boshqarish uchun mo'ljallangan keng qamrovli ta'lim boshqaruv tizimi.

## Loyiha Tavsifi

Bu loyiha Kundalik.com dan kengroq versiya bo'lib, butun O'zbekiston bo'yicha maktablarni boshqarish uchun yaratilgan. Tizimda faqat ro'yxatdan o'tkazilgan foydalanuvchilar tizimga kira oladi.

### Asosiy Xususiyatlar

- **Role-based Access Control**: Admin → Direktor → O'qituvchi → O'quvchi/Ota-ona tartibida foydalanuvchilar yaratiladi
- **Keng qamrovli boshqaruv**: Viloyat, shahar, maktab darajasida boshqaruv
- **Real-time ma'lumotlar**: Baholar, davomatiyatlik, dars jadvali
- **Statistik tahlil**: Har darajada batafsil statistika
- **Responsive design**: Barcha qurilmalarda mukammal ishlaydi

## Foydalanuvchi Rollari

### 1. Admin
- Viloyat va shaharlarni boshqaradi
- Maktablar yaratadi va direktorlarni tayinlaydi
- Barcha tizim ma'lumotlariga kirish huquqi
- Fanlar ro'yxatini boshqaradi

### 2. Direktor
- O'z maktabini boshqaradi
- Sinflar va o'qituvchilarni yaratadi
- Dars jadvalini tuzadi
- Baho o'zgartirish so'rovlarini ko'rib chiqadi
- Maktab statistikasini kuzatadi

### 3. O'qituvchi
- Baholar qo'yadi va o'zgartiradi
- Davomatni belgilaydi
- Uy vazifalarini beradi
- Sinf rahbarligi vazifalarini bajaradi (agar tayinlangan bo'lsa)

### 4. O'quvchi
- O'z baholarini ko'radi
- Davomatini kuzatadi
- Uy vazifalarini topshiradi
- Dars jadvalini ko'radi

### 5. Ota-ona
- Farzandning baholarini ko'radi
- Davomatini kuzatadi
- Sababnoma yuboradi

## Texnik Stack

### Frontend
- **React 18** - Asosiy framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI komponetlar
- **Lucide React** - Ikonlar
- **Recharts** - Grafik va diagrammalar

### Backend
- **.NET 8** - Backend framework
- **Entity Framework Core** - ORM
- **MediatR** - CQRS pattern
- **SQL Server** - Database

## O'rnatish va Ishga Tushirish

### Talablar
- Node.js 18+
- npm yoki yarn yoki bun

### Frontend o'rnatish
```bash
# Repositoriyani klonlash
git clone <repository-url>
cd eduuz-frontend

# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev

# Production build
npm run build
```

### Muhim konfiguratsiya

Backend deploy qilingandan keyin, quyidagi o'zgarishlarni amalga oshiring:

1. **API URL-ni o'zgartirish**: Barcha sahifalarda quyidagi qatorni toping va o'zgartiring:
```javascript
const API_BASE_URL = "http://localhost:5000"; // Production URL bilan almashtiring
```

2. **Mock data-ni o'chirish**: Har bir sahifada mock data mavjud, ularni actual API calls bilan almashtiring.

## Loyiha Strukturasi

```
src/
├── components/           # Qayta ishlatiluvchi komponentlar
│   ├── ui/              # Shadcn UI komponentlar
│   ├── layout/          # Layout komponentlari
│   └── dashboard/       # Dashboard komponentlari
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Sahifa komponentlari
│   ├── admin/          # Admin sahifalari
│   ├── director/       # Direktor sahifalari
│   ├── teacher/        # O'qituvchi sahifalari
│   ├── student/        # O'quvchi sahifalari
│   └── parent/         # Ota-ona sahifalari
└── App.tsx             # Asosiy App komponenti
```

## API Integration

Barcha API endpoint-lar `API_ENDPOINTS.md` faylida batafsil tavsiflangan. Asosiy xususiyatlar:

- **RESTful API**: Barcha CRUD operatsiyalar uchun
- **Role-based endpoints**: Har bir rol uchun alohida endpoint-lar
- **Error handling**: Barcha API call-larda error handling mavjud
- **Loading states**: Har bir sahifada loading indikatori

## Xususiyatlar

### ✅ Amalga oshirilgan
- [x] Role-based navigation
- [x] Admin panel (Viloyatlar, Shaharlar, Maktablar, Fanlar, Foydalanuvchilar)
- [x] Direktor paneli (Sinflar, O'qituvchilar, Dars jadvali, Statistika)
- [x] O'qituvchi paneli (Uy vazifalari, Baholar, Davomatiyatlik)
- [x] O'quvchi paneli (Baholar ko'rish)
- [x] Ota-ona paneli (Farzand ma'lumotlari)
- [x] Responsive design
- [x] API integration layihasi

### 🔄 Ishlanmoqda
- [ ] Authentication tizimi
- [ ] File upload functionality
- [ ] Push notification-lar
- [ ] Ko'p tilli interfeys

### 📋 Rejalashtirilgan
- [ ] Mobile app (React Native)
- [ ] Offline functionality
- [ ] Advanced reporting
- [ ] Integration with external systems

## Deployment

### Production uchun tayyorlash

1. **Environment variables**:
```bash
# .env.production
VITE_API_BASE_URL=https://your-backend-api.com
VITE_APP_NAME=EduUz
```

2. **Build qilish**:
```bash
npm run build
```

3. **Static hosting**: `dist` papkasini istalgan static hosting xizmatiga deploy qiling.

## Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## Aloqa

Savollar yoki takliflar uchun aloqa:
- Email: [your-email@example.com]
- Telegram: [@your-username]

---

**Eslatma**: Bu loyiha hali development bosqichida. Production muhitda ishlatishdan oldin barcha xavfsizlik choralarini ko'ring va to'liq testing o'tkazing.