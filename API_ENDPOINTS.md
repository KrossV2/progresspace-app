# EduUz Frontend - API Endpoints Documentation

Bu hujjatda frontend uchun kerak bo'lgan barcha API endpoint-lar ro'yxati keltirilgan.

## Base URL
Frontend kodida barcha API URL-lar comment sifatida belgilangan:
```javascript
// TODO: Replace with actual API URL
const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL
```

## Admin API Endpoints

### Regions (Viloyatlar)
- `GET /api/admin/regions` - Barcha viloyatlar ro'yxati
- `DELETE /api/admin/regions/{id}` - Viloyatni o'chirish

### Cities (Shaharlar)
- `GET /api/admin/cities` - Barcha shaharlar ro'yxati
- `POST /api/admin/cities` - Yangi shahar yaratish
- `PUT /api/admin/cities/{id}` - Shaharni yangilash
- `DELETE /api/admin/cities/{id}` - Shaharni o'chirish

### Schools (Maktablar)
- `GET /api/admin/schools` - Barcha maktablar ro'yxati
- `POST /api/admin/schools` - Yangi maktab yaratish
- `PUT /api/admin/schools/{id}` - Maktabni yangilash
- `DELETE /api/admin/schools/{id}` - Maktabni o'chirish

### Subjects (Fanlar)
- `GET /api/admin/subjects` - Barcha fanlar ro'yxati
- `POST /api/admin/subjects` - Yangi fan yaratish
- `PUT /api/admin/subjects/{id}` - Fanni yangilash
- `DELETE /api/admin/subjects/{id}` - Fanni o'chirish

### Users (Foydalanuvchilar)
- `GET /api/admin/users` - Barcha foydalanuvchilar ro'yxati
- `GET /api/admin/users/{id}` - Foydalanuvchi ma'lumotlari
- `POST /api/admin/users` - Yangi foydalanuvchi yaratish
- `PUT /api/admin/users/{id}` - Foydalanuvchini yangilash
- `DELETE /api/admin/users/{id}` - Foydalanuvchini o'chirish
- `GET /api/admin/users/search` - Foydalanuvchilarni qidirish

### Directors (Direktorlar)
- `GET /api/admin/directors` - Barcha direktorlar ro'yxati
- `POST /api/admin/directors` - Yangi direktor yaratish
- `PUT /api/admin/directors/{id}` - Direktorni yangilash
- `DELETE /api/admin/directors/{id}` - Direktorni o'chirish

## Director API Endpoints

### Classes (Sinflar)
- `GET /api/director/classes` - Barcha sinflar ro'yxati
- `POST /api/director/classes` - Yangi sinf yaratish
- `PUT /api/director/classes/{id}` - Sinfni yangilash
- `DELETE /api/director/classes/{id}` - Sinfni o'chirish
- `GET /api/director/classes/{id}/students` - Sinfdagi o'quvchilar ro'yxati

### Teachers (O'qituvchilar)
- `GET /api/director/teachers` - Barcha o'qituvchilar ro'yxati
- `POST /api/director/teachers` - Yangi o'qituvchi yaratish
- `PUT /api/director/teachers/{id}` - O'qituvchini yangilash
- `DELETE /api/director/teachers/{id}` - O'qituvchini o'chirish
- `GET /api/director/teachers/{id}/subjects` - O'qituvchining fanlari
- `POST /api/director/teachers/{id}/subjects` - O'qituvchiga fan qo'shish

### Timetables (Dars jadvali)
- `GET /api/director/timetables` - Barcha dars jadvali
- `POST /api/director/timetables` - Yangi dars qo'shish
- `PUT /api/director/timetables/{id}` - Darsni yangilash
- `DELETE /api/director/timetables/{id}` - Darsni o'chirish

### Grade Requests (Baho o'zgartirish so'rovlari)
- `GET /api/director/grade-requests` - Barcha so'rovlar ro'yxati
- `POST /api/director/grade-requests/{id}/approve` - So'rovni tasdiqlash
- `POST /api/director/grade-requests/{id}/reject` - So'rovni rad etish
- `GET /api/director/grade-requests/reports/{studentId}` - O'quvchi hisoboti

### Statistics (Statistika)
- `GET /api/director/statistics/classes` - Sinflar statistikasi
- `GET /api/director/statistics/teachers` - O'qituvchilar statistikasi
- `GET /api/director/statistics/attendance` - Davomatiyatlik statistikasi

## Teacher API Endpoints

### Homeworks (Uy vazifalari)
- `GET /api/teacher/homeworks` - Barcha uy vazifalari
- `GET /api/teacher/homeworks/{id}` - Uy vazifasi ma'lumotlari
- `POST /api/teacher/homeworks` - Yangi uy vazifasi yaratish
- `PUT /api/teacher/homeworks/{id}` - Uy vazifasini yangilash
- `DELETE /api/teacher/homeworks/{id}` - Uy vazifasini o'chirish
- `POST /api/teacher/homeworks/{id}/materials` - Material yuklash

### Grades (Baholar)
- `POST /api/teacher/grades` - Yangi baho qo'yish
- `PUT /api/teacher/grades/{id}` - Bahoni yangilash
- `GET /api/teacher/grades/students/{studentId}` - O'quvchi baholari
- `GET /api/teacher/grades/classes/{classId}` - Sinf baholari
- `GET /api/teacher/grades/subjects/{subjectId}` - Fan bo'yicha baholar

### Attendance (Davomatiyatlik)
- `POST /api/teacher/attendance` - Davomatni belgilash
- `PUT /api/teacher/attendance/{id}` - Davomatni yangilash
- `GET /api/teacher/attendance/classes/{classId}` - Sinf davomati
- `GET /api/teacher/attendance/students/{studentId}` - O'quvchi davomati
- `GET /api/teacher/attendance/reports` - Davomat hisobotlari

### Tutor Functions (Sinf rahbarligi)
- `POST /api/teacher/students` - Yangi o'quvchi qo'shish
- `POST /api/teacher/parents` - Yangi ota-ona qo'shish
- `POST /api/teacher/link-parent-student` - Ota-ona va o'quvchini bog'lash

## Student API Endpoints

### Student Data (O'quvchi ma'lumotlari)
- `GET /api/student/attendances` - Mening davomatim
- `GET /api/student/grades` - Mening baholarim
- `GET /api/student/homeworks` - Mening uy vazifalarim
- `GET /api/student/timetables` - Mening dars jadvalim
- `GET /api/student/behaviors/{studentId}` - Mening xulq-atvorim
- `GET /api/student/notifications/{userId}` - Mening xabarlarim

### Homework Submission (Uy vazifasi topshirish)
- `POST /api/student/homeworks/{homeworkId}/submit` - Uy vazifasini topshirish

## Parent API Endpoints

### Child Data (Farzand ma'lumotlari)
- `GET /api/parent/children/{childId}/attendances` - Farzand davomati
- `GET /api/parent/children/{childId}/behaviors` - Farzand xulq-atvori
- `GET /api/parent/children/{childId}/grades` - Farzand baholari
- `GET /api/parent/children/{childId}/timetables` - Farzand dars jadvali

### Excuses (Sababnoma)
- `POST /api/parent/children/{childId}/excuses` - Sababnoma yuborish

## Data Transfer Objects (DTOs)

### Asosiy DTOlar
Backend'da mavjud bo'lgan asosiy DTO'lar:

#### User DTOs
- `UserResponseDto`
- `DirectorCreateDto`
- `TeacherResponseDto`
- `StudentCreateDto`
- `StudentResponseDto`

#### Academic DTOs
- `SubjectUpdateDto`
- `ClassResponseDto`
- `ClassCreateDto`
- `ClassUpdateDto`
- `GradeCreateDto`
- `GradeResponseDto`
- `GradeUpdateDto`
- `GradeChangeRequestDto`

#### Schedule DTOs
- `TimetableCreateDto`
- `TimetableResponseDto`
- `TimetableUpdateDto`
- `LessonScheduleDto`
- `LessonScheduleCreateDto`

#### Homework DTOs
- `HomeworkCreateDto`
- `HomeworkResponseDto`
- `HomeworkUpdateDto`

#### Location DTOs
- `RegionUpdateDto`
- `CityDto`
- `CityResponseDto`
- `CityCreateDto`
- `CityUpdateDto`
- `SchoolUpdateDto`

#### Other DTOs
- `AttendanceDto`
- `BehaviorRecordDto`
- `BehaviorRecordResponseDto`
- `NotificationDto`
- `NotificationResponseDto`
- `TeacherStatisticsDto`

## Authentication va Authorization

### Authentication
- `POST /api/auth/signin` - Tizimga kirish
- `POST /api/auth/refresh` - Token yangilash
- `POST /api/auth/forgot-password` - Parolni unutdim
- `POST /api/auth/reset-password` - Parolni tiklash

### Role-based Access
Har bir endpoint uchun tegishli rol talab qilinadi:
- Admin: Barcha admin endpoint-lariga kirish
- Director: O'z maktabi bo'yicha director endpoint-lariga kirish
- Teacher: O'z sinf va fanlariga oid teacher endpoint-lariga kirish
- Student: Faqat o'z ma'lumotlariga kirish
- Parent: Faqat farzandlarining ma'lumotlariga kirish

## Frontend Implementation Notes

1. **API URL Configuration**: Barcha sahifalarda `API_BASE_URL` o'zgaruvchisi comment sifatida qoldirilgan
2. **Error Handling**: Har bir API call uchun try-catch blok qo'llanilgan
3. **Loading States**: Har bir sahifada loading state mavjud
4. **Toast Notifications**: Muvaffaqiyat va xatoliklar uchun toast notification-lar qo'llanilgan
5. **Mock Data**: Hozircha barcha sahifalarda mock data ishlatilmoqda

## Deployment uchun o'zgarishlar

Backend deploy qilingandan keyin:

1. Barcha fayllardan `API_BASE_URL` ni topib, production URL bilan almashtiring
2. Mock data-larni olib tashlang
3. Actual API call-larni faollashtiring

Masalan:
```javascript
// O'zgartirish kerak:
const API_BASE_URL = "http://localhost:5000";

// Production URL bilan:
const API_BASE_URL = "https://your-backend-domain.com";
```