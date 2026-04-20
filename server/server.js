import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect DB
connectDB();

// Allowed origins (NO trailing slash)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mern-authentication-beta.vercel.app",
  "https://mern-authentication-git-main-nabin-karkis-projects-d6b8accc.vercel.app",
];

// ✅ CORS MUST BE FIRST
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API working");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
