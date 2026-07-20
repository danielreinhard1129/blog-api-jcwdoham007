import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { corsOptions } from "./config/cors.js";
import { loggerHttp } from "./lib/logger-http.js";
import { authRoutes } from "./routes/auth.routes.js";
import { blogRoutes } from "./routes/blog.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { reminderCron } from "./scripts/reminder.js";
import { globalError, notFoundError } from "./utils/errors.js";
import { expiredTransactionCron } from "./scripts/transaction.js";

const app = express();

// configs
app.use(cors(corsOptions));
app.use(express.json()); // agar bisa menerima req.body
app.use(cookieParser());
app.use(loggerHttp);

// entry point
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/transactions", transactionRoutes);

// errors
app.use(globalError);
app.use(notFoundError);

// cron
reminderCron();
expiredTransactionCron();

export default app;
