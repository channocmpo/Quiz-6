# Car Wash & Detailing Services Platform

Full-stack web platform for listing and availing car wash/detailing services with multi-role access:
- **Admin**
- **Seller**
- **User**

Tech stack:
- **Frontend:** React + React Bootstrap + Bootswatch + Redux
- **Backend:** Django + Django REST Framework + JWT
- **AI Chatbot:** Gemini (via backend `/api/v1/chat/ask/`)

---

## Features

### Frontend
- Branded landing-style UI (dark/red car wash theme)
- Auth screens (Sign In / Sign Up)
- Home service listing cards
- Service detail page + PayPal redirect flow
- Seller application page
- Admin user management page with:
  - Users table (Edit/Delete UI)
  - Seller applications tab (Approve/Decline with modals)
- Seller dashboard (add/manage services with image upload)
- User profile page + order history table
- Floating Gemini chatbot tab

### Backend
- Custom user model (`CustomUserModel`) with roles and merchant ID
- JWT login/authentication
- Seller application lifecycle endpoints
- Service CRUD + image upload
- Order creation + history
- Chat endpoint to Gemini API

---

## Project Structure

```text
Quiz 6/
├─ backend/
│  ├─ config/
│  ├─ users/
│  ├─ applications/
│  ├─ services/
│  ├─ orders/
│  ├─ chat/
│  └─ manage.py
├─ src/
├─ public/
├─ package.json
└─ README.md
```

---

## Setup Instructions

## 1) Backend Setup (Django)

### Install dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

### Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Run backend server
```bash
python manage.py runserver
```

Backend runs at:
- `http://127.0.0.1:8000`

---

## 2) Frontend Setup (React)

From project root:

```bash
npm install
npm start
```

Frontend runs at:
- `http://localhost:3000`

---

## Environment Variables

### Backend (recommended)
Set Gemini key as environment variable:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

> Note: Key is currently also present in Django settings fallback. For security, move to env-only in production.

### Frontend (optional)
Default API base URL already points to local Django API.
If needed, set:

```bash
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## Demo Accounts

Seeded credentials:

- **Admin**
  - Email: `admin@platform.com`
  - Password: `admin123`
- **Seller**
  - Email: `seller@platform.com`
  - Password: `seller123`
- **User**
  - Email: `user@platform.com`
  - Password: `user123`

If your database is empty, create users via Sign Up or Django shell.

---

## API Base Routes

- `/api/v1/users/`
- `/api/v1/applications/`
- `/api/v1/services/`
- `/api/v1/orders/`
- `/api/v1/chat/`

### Users
- `POST /api/v1/users/login/`
- `POST /api/v1/users/register/`
- `GET /api/v1/users/profile/`
- `GET /api/v1/users/admin/users/`

### Applications
- `POST /api/v1/applications/apply/`
- `GET /api/v1/applications/list/`
- `POST /api/v1/applications/<pk>/approve/`
- `POST /api/v1/applications/<pk>/decline/`

### Services
- `GET /api/v1/services/list/`
- `GET /api/v1/services/<pk>/`
- `GET/POST /api/v1/services/manage/`
- `GET/PATCH/DELETE /api/v1/services/manage/<pk>/`

### Orders
- `POST /api/v1/orders/create/`
- `GET /api/v1/orders/history/`

### Chat
- `POST /api/v1/chat/ask/`

---

## JWT Usage

1. Login via `/api/v1/users/login/`
2. Copy returned `access` token
3. Send header:

```text
Authorization: Bearer <access_token>
```

---

## Notes

- Root backend URL (`/`) returns API route summary JSON.
- CORS is enabled for local frontend origins.
- Bootswatch source-map warning during frontend build is non-blocking.

---

## Quick Run Checklist

1. Start backend (`python manage.py runserver`)
2. Start frontend (`npm start`)
3. Login with demo account
4. Test:
   - apply seller
   - admin approve/decline
   - seller dashboard CRUD
   - order creation/history
   - floating chatbot
