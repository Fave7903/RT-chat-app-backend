# Chat Backend (Node.js + TypeScript + Socket.IO + Sequelize + MySQL)

A real-time chat backend featuring authentication, public/private rooms, presence tracking, typing indicators, rate limiting, and message history.

---

## Features
- **JWT Authentication** with bcrypt password hashing  
- **Public/Private Rooms** with invite system  
- **Real-Time Messaging** via Socket.IO  
- **Presence Tracking** (online/offline + last seen)  
- **Typing Indicators** per room  
- **Message Rate Limiting** (5 messages / 10s per user per room)  
- **Paginated Chat History**  
- **Delivery & Read Receipts**

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express, TypeScript  
- **WebSockets:** Socket.IO  
- **Database:** MySQL with Sequelize ORM (`mysql2`)  
- **Security & Validation:** Zod, Helmet, CORS  

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Fave7903/RT-chat-app-backend.git
cd RT-chat-app-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
- Copy .env.example → .env
- Fill in required values (MySQL credentials or DATABASE_URL, JWT secret, port, etc.)

### Example:

```env
DATABASE_URL=mysql://user:password@localhost:3306/chatdb
JWT_SECRET=supersecretkey
PORT=4000
```

### 4. Run in Development
```bash
npm run dev
```

### 5. Build & Run in Production
```bash
npm run build
npm start
```

# REST API Endpoints

## Authentication
- **POST** `/api/auth/register` → Register a new user  
- **POST** `/api/auth/login` → Login and receive JWT  

---

## Rooms
- **POST** `/api/rooms` *(auth required)* → Create room  
- **POST** `/api/rooms/join` *(auth required)* → Join room via invite code  
- **GET** `/api/rooms/mine` *(auth required)* → List user’s rooms  
- **GET** `/api/rooms/:roomId/messages` *(auth required)* → Get paginated messages  

---

## Misc
- **GET** `/health` → Health check  

## Socket.IO Events

## Client → Server
- **join_room** → `{ roomId, inviteCode? }`  
- **send_message** → `{ roomId, content }`  
- **typing** → `{ roomId, isTyping }`  

---

## Server → Client
- **receive_message** → Broadcast new messages  
- **user_status** → `{ userId, online, lastSeen }`  
- **read_receipt** → `{ messageId }`  
