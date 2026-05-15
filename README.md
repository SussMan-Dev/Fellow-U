# Fellow4U Travel App

Flutter app + Express backend cho ung dung du lich. Backend khong dung mock data nua; server doc thong tin Firebase tu:

```text
android/app/google-services.json
```

Firebase project hien tai: `duc-huy-d243d`.

## Chay backend

```bash
cd backend
npm install
npm run dev
```

Server backend mac dinh chay tai:

```text
http://localhost:3000
```

Flutter app mac dinh goi:

```text
http://localhost:3000/api
```

## Demo web tren Chrome va Edge

Chay backend truoc:

```bash
cd backend
npm run dev
```

Mo terminal thu hai de chay Chrome:

```bash
flutter run -d chrome --web-port 8080 --dart-define=API_BASE_URL=http://localhost:3000/api
```

Mo terminal thu ba de chay Edge:

```bash
flutter run -d edge --web-port 8081 --dart-define=API_BASE_URL=http://localhost:3000/api
```

Sau khi chay, demo tren:

```text
Chrome: http://localhost:8080
Edge:   http://localhost:8081
```

Trong VS Code co the bam Run and Debug va chon:

```text
Flutter Web - Chrome
Flutter Web - Edge
```

Neu demo tren Android Emulator hoac dien thoai cam USB, chay them lenh reverse port truoc khi bam Sign Up:

```bash
adb reverse tcp:3000 tcp:3000
```

Sau do chay app:

```bash
flutter run
```

Neu khong muon dung `adb reverse`, Android Emulator co the goi localhost cua may bang `10.0.2.2`:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

Neu chay tren may that khong cam USB, truyen IP LAN that cua may dang chay backend bang `--dart-define`. Khong copy chu `IP_MAY_TINH`; hay thay bang dia chi dang hien tren may cua ban, vi du `192.168.1.10`:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.1.10:3000/api
```

## Firebase database

Backend doc Firestore bang Firebase REST API. Cac collection can co:

| Collection | Muc dich |
| --- | --- |
| `banners` | Anh banner, field nen co: `url` |
| `journeys` | Top journeys |
| `guides` | Huong dan vien |
| `experiences` | Trai nghiem |
| `tours` | Danh sach tour |
| `trips` | Trip chung neu khong truyen `uid` |
| `users/{uid}/trips` | Trip rieng cua tung user |
| `users` | Profile user tao tu API signup |

## API da hoan thanh

Base URL:

```text
http://localhost:3000/api
```

| # | Method | Endpoint | Firebase | Mo ta |
| --- | --- | --- | --- | --- |
| 1 | `POST` | `/signup` | Firebase Auth + `users/{uid}` | Dang ky user va luu profile vao Firestore |
| 2 | `POST` | `/login` | Firebase Auth | Dang nhap bang email/password |
| 3 | `GET` | `/banners` | `banners` | Lay danh sach banner |
| 4 | `GET` | `/journeys` | `journeys` | Lay top journeys |
| 5 | `GET` | `/guides` | `guides` | Lay danh sach guides |
| 6 | `GET` | `/experiences` | `experiences` | Lay experiences |
| 7 | `GET` | `/tours` | `tours` | Lay danh sach tours |
| 8 | `GET` | `/tours/:id` | `tours/{id}` | Lay chi tiet 1 tour |
| 9 | `GET` | `/trips?status=Current%20Trips&uid={uid}` | `users/{uid}/trips` hoac `trips` | Lay trips theo status |
| 10 | `POST` | `/users/:uid/trips` | `users/{uid}/trips` | Tao trip moi cho user |
| 11 | `GET` | `/products` | `tours` | Du lieu trang Products |
| 12 | `GET` | `/search?q=da%20nang` | `tours`, `journeys`, `guides`, `experiences`, `trips` | Tim kiem tren Explore |
| 13 | `GET` | `/trips/:id` | `trips` | Chi tiet trip cho nut Detail |
| 14 | `GET` | `/users/:uid` | `users/{uid}` | Profile user |
| 15 | `PATCH` | `/users/:uid` | `users/{uid}` | Cap nhat profile |
| 16 | `POST` | `/forgot-password` | Firebase Auth | Gui email reset password |
| 17 | `GET` | `/users/:uid/notifications` | `users/{uid}/notifications` | Notifications |
| 18 | `GET` | `/users/:uid/settings` | `users/{uid}/settings/default` | Lay settings |
| 19 | `PATCH` | `/users/:uid/settings` | `users/{uid}/settings/default` | Cap nhat settings |
| 20 | `GET` | `/help` | Demo/static | Help Center |
| 21 | `GET` | `/about` | Demo/static | About Us |
| 22 | `GET` | `/chats?tripId={tripId}` | `chats` | Lay tin nhan cho nut Chat |
| 23 | `POST` | `/chats` | `chats` | Gui tin nhan |


## Chi tiet request

### 1. Dang ky

```http
POST /api/signup
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "123456",
  "firstName": "Huy",
  "lastName": "Nguyen",
  "country": "Vietnam",
  "userType": "traveler"
}
```

### 2. Dang nhap

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response tra ve `idToken`, `refreshToken` va `user.id`.

### 3-8. Lay du lieu hien thi

```http
GET /api/banners
GET /api/journeys
GET /api/guides
GET /api/experiences
GET /api/tours
GET /api/tours/{tourId}
```

### 9. Lay trips

Lay trip theo user:

```http
GET /api/trips?status=Next%20Trips&uid={uid}
```

Hoac gui Firebase `idToken` sau khi login:

```http
GET /api/trips?status=Next%20Trips
Authorization: Bearer {idToken}
```

Neu khong co `uid` va khong co token, backend se doc collection chung `trips`.

### 10. Tao trip

```http
POST /api/users/{uid}/trips
Content-Type: application/json
```

```json
{
  "title": "Dragon Bridge Trip",
  "location": "Da Nang, Vietnam",
  "date": "Jan 30, 2026",
  "time": "13:00 - 15:00",
  "image": "assets/dragonbridge.png",
  "avatar": "assets/anna.png",
  "status": "Current Trips"
}
```

## Kiem tra nhanh

```bash
cd backend
npm test
npm run dev
```

Health check:

```http
GET http://localhost:3000/api/health
```
