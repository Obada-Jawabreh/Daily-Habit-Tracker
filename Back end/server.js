const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const habitRoutes = require("./Routes/habitRoutes");
const cookieParser = require('cookie-parser');
const app = express();

// Connect to MongoDB
connectDB();

app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // تسجيل الأصل المطلوب
    // console.log('Requested Origin:', origin);

    // السماح بالطلبات التي تحتوي على رأس Origin من localhost
    if (!origin || origin.startsWith('http://localhost:3000') || origin.startsWith('http://localhost:5174')) {
      return callback(null, true);
    }
    // رد برسالة خطأ إذا لم يكن الأصل مسموحًا به
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api", habitRoutes);

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // تسجيل رسالة الخطأ
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
