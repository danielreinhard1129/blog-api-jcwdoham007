import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { corsOptions } from "./config/cors.js";
import { authRoutes } from "./routes/auth.routes.js";
import { blogRoutes } from "./routes/blog.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { globalError, notFoundError } from "./utils/errors.js";

const PORT = 8000;

const app = express();

// configs
app.use(cors(corsOptions));
app.use(express.json()); // agar bisa menerima req.body
app.use(cookieParser());

// entry point
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

// errors
app.use(globalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});

// pigiri3887@googxs.com
