
# 🧠 SmartAttendance

SmartAttendance is a modern web application built using the **MERN stack (MongoDB, Express, React, Node.js)**. It provides a smart and efficient solution for managing student attendance — replacing outdated paper-based systems with a seamless digital workflow.

---

## 🚀 Features

- 📋 **Role-based login and dashboard** for Students, Teachers, and Admins
- ✅ **Attendance marking** system for teachers
- 📊 **Attendance reports** and analytics
- 📅 **Calendar-based attendance tracking**
- 🖼️ **Student profile management** (name, email, roll number, photo)
- 🔐 **JWT-based authentication**
- 💡 **AI-powered tools** (in future: summarization, report generation)
- 💻 **Responsive and user-friendly UI**
- Admin Panel: Create, update, and manage classrooms and users

---

## 🔧 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary (for image upload)
- JWT (Authentication)

---

## 📁 Project Structure

```
client/               # React frontend
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Routes & pages like Dashboard, Login, etc.
│   ├── assets/       # Icons, images, logos
│   ├── context/      # Global state (AppContext)
│   └── App.js
server/               # Express backend
├── controllers/      # Route handlers
├── models/           # MongoDB schemas
├── routes/           # API routes
├── middleware/       # Auth & error handling
├── utils/            # Cloudinary setup, helpers
└── server.js
```

---

## 🧪 How to Run Locally

### 🔨 Backend Setup

```bash
cd server
npm install
touch .env
```

Add the following to your `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start server:
```bash
npm run dev
```

### 💻 Frontend Setup

```bash
cd client
npm install
```

Start React app:
```bash
npm run dev
```

---

## 🌐 Live Demo

<!-- > https://attendance-management-frontend-vsnq.onrender.com -->
https://attendance-mamagement-frontend.vercel.app/

---

## 🧠 Future Improvements

- Attendance Analytics Dashboard
- PDF/Excel Export for attendance reports
- AI-powered insights and feedback
- Dark mode

---

## 🙋‍♂️ Author

**Harish Dewangan**  
[GitHub](https://github.com/officialharis) • [Instagram](https://www.instagram.com/_its_harish/) • [Email](mailto:h10dewangan@gmail.com)

---
